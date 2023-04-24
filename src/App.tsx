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

  const handleChange = () => {
    if (!refEditor.current) {
      return;
    }
    console.log(refEditor.current.editor?.data?.get());
    console.log(
      Array.from(refEditor.current.editor?.ui.componentFactory.names() ?? [])
    );
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
            <a className="navbar-item">Publish</a>
          </div>
        </div>
      </div>
      <div className="content">
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          ref={refEditor}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default App;
