import React, { useContext } from "react";

//!----------> BOOTSTRAP IMPORT
import { Button, Container, Image, Alert } from "react-bootstrap";

//!----------> ROUTER-DOM IMPORT
import { Link } from "react-router-dom";

//!----------> CONTEXT IMPORT
import { ThemeContext } from "../../context/themeContext";

//!----------> CSS IMPORT
import "./notFound.css";

const NotFound = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Container>
      <div>
        <div>
          <div className="page_404">
            <div className="four_zero_four_bg ">
              <h1 className="text-center ">4 0 4</h1>
            </div>

            <div
              className={`d-flex flex-column justify-content-center align-items-center ${
                theme === "light" ? "" : "text-light"
              }`}
            >
              <h3 className="h2">Seems like you're lost in StriveBlog!</h3>

              <p>The page you are looking for is not avaible!</p>

              <Link to={"/homepage"} className="link_404">
                <Button variant="success">Back to Homepage</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
