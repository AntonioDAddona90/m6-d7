import React, { useContext, useRef, useState } from "react";

//!----------> UTILITIES IMPORT
import { nanoid } from "nanoid";
import axios from "axios";

//!----------> BOOTSTRAP IMPORT
import { Container, Alert } from "react-bootstrap";

//!----------> ROUTER-DOM IMPORT
import { useParams, Link } from "react-router-dom";

//!----------> CONTEXT IMPORT
import { ThemeContext } from "../../context/themeContext";
import { AuthorsContext } from "../../context/AuthorsContenx";

//!----------> CUSTOM HOOKS IMPORT
import { useSession } from "../../middlewares/ProtectedRoutes";

//!----------> REACT ICONS IMPORT
import { TbRefresh } from "react-icons/tb";

//!----------> CSS IMPORT
import "./authorPage.css";

const AuthorPage = () => {
  const { theme } = useContext(ThemeContext);
  const { authors, setAuthors } = useContext(AuthorsContext);

  const params = useParams();
  const { id } = params;

  const selectedAuthor = authors.find((author) => author._id === id);

  const session = useSession();
  // console.log(session);

  const userLogged = selectedAuthor._id === session.id;
  console.log(userLogged);

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const [file, setFile] = useState(null);

  const handleAvatarUpdate = async (e) => {
    setFile(e.target.files[0]);

    if (e.target.files.length > 0) {
      const uploadedFile = await uploadFile(e.target.files[0]);

      if (uploadedFile) {
        try {
          const response = await axios.patch(
            `http://localhost:5050/authors/${selectedAuthor._id}`,
            { avatar: uploadedFile.avatar },
            { headers: { "Content-Type": "application/json" } }
          );

          const updatedAuthors = authors.map((author) =>
            author._id === selectedAuthor._id ? { ...author, avatar: uploadedFile.avatar } : author
          );
          setAuthors(updatedAuthors);

          return response.data;
        } catch (error) {
          console.log("Error occurs updating author: ", error);
        }
      } else {
        console.error("File upoload failed");
      }
    }
  };

  const uploadFile = async (file) => {
    const avatarData = new FormData();
    avatarData.append("avatar", file);

    try {
      const response = await axios.post(
        "http://localhost:5050/authors/cloudUploadAvatar",
        avatarData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Avatar upload error occurs: ", error);
    }
  };

  return (
    <>
      {!selectedAuthor ? (
        <Alert className="text-center" variant="danger">
          OOOOOPS... seems like this page doesn't exists anymore!
        </Alert>
      ) : (
        <Container
          className={theme === "light" ? "" : "text-light"}
          style={{ paddingTop: "10rem" }}
        >
          <h1>Hello World,</h1>
          <h2>
            {selectedAuthor.firstName} {selectedAuthor.lastName} here!
          </h2>

          <div className="AuthorPageImgWrapper">
            <img
              src={selectedAuthor.avatar}
              alt=""
              style={{
                borderRadius: "50%",
                width: "300px",
                height: "300px",
                background: "#ffffff",
                objectFit: "cover",
              }}
              className="my-5"
            />

            {userLogged && (
              <p className="changeAvatarIcon">
                <TbRefresh onClick={handleIconClick} />
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpdate}
            />
          </div>

          <h5>{selectedAuthor.firstName}'s blogPosts: </h5>
          <ul>
            {selectedAuthor.blogPosts.map((blogPost) => {
              return (
                <li key={nanoid()}>
                  <Link className="linkToBlogPost" to={`/blogPage/${blogPost._id}`}>
                    {blogPost.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      )}
    </>
  );
};

export default AuthorPage;