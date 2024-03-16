import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";

import { CanvassProvider } from "./context/CanvassContext";
import { SelectedAuthorProvider } from "./context/SelectedAuthorContext";
import { ThemeProvider } from "./context/themeContext";
import { SelectedBlogPostProvider } from "./context/SelectedBlogPostContext";
import { NewCommentProvider } from "./context/NewCommentContext";
import { AuthorsProvider } from "./context/AuthorsContenx";
import { PostsProvider } from "./context/PostsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <PostsProvider>
        <AuthorsProvider>
          <NewCommentProvider>
            <SelectedBlogPostProvider>
              <SelectedAuthorProvider>
                <CanvassProvider>
                  <App />
                </CanvassProvider>
              </SelectedAuthorProvider>
            </SelectedBlogPostProvider>
          </NewCommentProvider>
        </AuthorsProvider>
      </PostsProvider>
    </ThemeProvider>
  </React.StrictMode>
);