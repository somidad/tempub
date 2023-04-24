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
    { key: "Key 0" },
    { key: "Key 1" },
    { key: "Key 2" },
    { key: "Key 3" },
    { key: "Key 4" },
    { key: "Key 5" },
    { key: "Key 6" },
    { key: "Key 7" },
    { key: "Key 8" },
    { key: "Key 9" },
  ]);
  const [renderList, setRenderList] = useState<RenderResult[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.Editing
  );
  const [keyIndex, setKeyIndex] = useState(-1);

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
    setKeyIndex(-1);
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
          <div
            className="modal-card"
            style={{
              width: "calc(100vw - 40px)",
              height: "calc(100vh - 40px)",
            }}
          >
            <div className="modal-card-head">
              <div className="modal-card-title">Proofreading</div>
            </div>
            <div className="modal-card-body">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="menu">
                  <ul className="menu-list">
                    {renderList.map((render, index) => (
                      <li key={render[KEY]}>
                        <a
                          className={index === keyIndex ? "is-active" : ""}
                          onClick={() => setKeyIndex(index)}
                        >
                          {render[KEY]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ flexGrow: "1" }}>
                  <div
                    className="box content"
                    dangerouslySetInnerHTML={{
                      __html: renderList[keyIndex]?.rendered,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-card-foot"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
