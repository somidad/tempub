import "./App.css";
import "bulma/css/bulma.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createRef, useState } from "react";
import dot from "dot";
import editorConfig from "./editorConfig";

enum EditorState {
  Editing,
  Publishing,
  Displaying,
}

type RenderResult = {
  [KEY]: string;
  rendered: string;
};

// TODO: Make these configurable
const KEY = "key";
dot.templateSettings.varname = "data";

function App() {
  const refEditor = createRef<CKEditor<ClassicEditor>>();
  const [envList, setEnvList] = useState<any[]>([
  ]);
  const [renderList, setRenderList] = useState<RenderResult[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.Editing
  );

  const clearEditor = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    refEditor.current.editor.data.set("");
  };

  const publish = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    setEditorState(EditorState.Publishing);
    const template = refEditor.current.editor.data.get();
    const templateFunction = dot.template(template);

    const renderList: RenderResult[] = [];
    envList.forEach((env) => {
      const rendered = templateFunction(env);
      renderList.push({ [KEY]: env[KEY], rendered });
    });
    setRenderList(renderList);
    setEditorState(EditorState.Displaying);
  };

  const tryCloseModal = () => {
    if (editorState === EditorState.Displaying) {
      setEditorState(EditorState.Editing);
    }
  };

  const isModalActive = editorState !== EditorState.Editing ? "is-active" : "";

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
      <div className={`modal ${isModalActive}`}>
        <div className="modal-background" onClick={tryCloseModal}></div>
        {editorState === EditorState.Publishing && (
          <div className="modal-content">
            <progress className="progress" max="100"></progress>
          </div>
        )}
        {editorState === EditorState.Displaying && (
          <div className="modal-card">
            <div className="modal-card-head"></div>
            <div className="modal-card-body"></div>
            <div className="modal-card-foot"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
