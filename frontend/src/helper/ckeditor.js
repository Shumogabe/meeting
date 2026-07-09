import React from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { APP_ADMIN_URI } from "../config";

const API_URL = "http://localhost:5100";
const UPLOAD_ENDPOINT = "img";

export default function MyEditor({ handleChange, ...props }) {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("files", file);
            let headers = new Headers();
            // headers.append("Origin", "https://citis.monre.gov.vn");
            headers.append("Origin", "http://localhost:3000");
            fetch(`${APP_ADMIN_URI}/${UPLOAD_ENDPOINT}`, {
              mode: "no-cors",
              method: "post",
              body: body,
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: `${API_URL}/${res.filename}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }
  return (
    <div className="App">
      <CKEditor
        // config={{
        //   extraPlugins: [uploadPlugin],
        // }}
        editor={ClassicEditor}
        onReady={(editor) => {}}
        onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {}}
        onChange={(event, editor) => {
          handleChange(editor.getData());
        }}
        {...props}
      />
    </div>
  );
}
