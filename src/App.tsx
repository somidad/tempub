import "./App.css";
import "bulma/css/bulma.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createRef, useState } from "react";
import editorConfig from "./editorConfig";


function App() {
  const refEditor = createRef<CKEditor<ClassicEditor>>();

  const clearEditor = () => {
    if (!refEditor.current) {
      return;
    }
    refEditor.current.editor?.data?.set("");
  };

  const publish = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    const template = refEditor.current.editor.data.get();
    const templateFunction = dot.template(template);
  };

  return (
    <div className="App">
      <div className="navbar">
        <div className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item" onClick={clearEditor}>
              New
            </a>
            <a className="navbar-item">Load</a>
            <a className="navbar-item">Save</a>
            <a className="navbar-item">Info</a>
            <a className="navbar-item" onClick={publish}>
              Publish
            </a>
          </div>
        </div>
      </div>
      <div className="content">
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          ref={refEditor}
        />
      </div>
    </div>
  );
}

export default App;
