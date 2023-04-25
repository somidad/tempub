import "./App.css";
import "bulma/css/bulma.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createRef, useEffect, useState } from "react";
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
  const refFile = createRef<HTMLInputElement>();
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

  useEffect(() => {
    if (!refFile.current || !refEditor.current?.editor) {
      return;
    }
    refFile.current.addEventListener("change", () => {
      if (!refFile.current?.files?.length) {
        return;
      }
      const [file] = refFile.current.files;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") {
          return;
        }
        refEditor.current?.editor?.data.set(reader.result);
      });
      reader.readAsText(file);
    });
  }, [refFile, refEditor]);

  const clearEditor = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    refEditor.current.editor.data.set("");
  };

  const load = () => {
    if (!refFile.current) {
      return;
    }
    refFile.current.click();
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

  const matchedKeysList = renderList.map((render) => {
    const matchedKeys = renderList
      .filter(
        (toFilter) =>
          toFilter[KEY] !== render[KEY] && toFilter.rendered === render.rendered
      )
      .map((toMap) => toMap[KEY]);
    return matchedKeys;
  });
  return (
    <div className="App">
      <div className="field is-grouped">
        <div className="control">
          <a className="button is-text" onClick={clearEditor}>
            New
          </a>
        </div>
        <div className="control">
          <a className="button is-text" onClick={load}>
            Load
          </a>
          <input type="file" ref={refFile} style={{ display: "none" }} />
        </div>
        <div className="control">
          <input className="input"></input>
        </div>
        <div className="control">
          <a className="button is-text">Save</a>
        </div>
        <div className="control">
          <a className="button is-text">Info</a>
        </div>
        <div className="control">
          <a className="button is-text" onClick={publish}>
            Publish
          </a>
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
                  <div className="tags">
                    Matched keys: {matchedKeysList[keyIndex]?.join(", ")}
                  </div>
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
