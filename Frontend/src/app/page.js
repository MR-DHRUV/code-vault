"use client";
import CodeMirror from '@uiw/react-codemirror';
import { useState } from "react";
import { githubDark } from "@uiw/codemirror-theme-github";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

// hey copilot
// suggest a name for this app
// want something ending with fy
// code wizard, xCode
// something like that
// codeify
// some other name


export default function Home() {

    const [codeData, setCodeData] = useState(``);
    const [lang, setLang] = useState(2);
    const [validationErrors, setValidationErrors] = useState({});
    const router = useRouter();

    // C+, js, python, java
    const languages = [
        {
            name: 'C++',
            id: 54,
            highlighter: cpp
        },
        {
            name: 'Java',
            id: 91,
            highlighter: java
        },
        {
            name: 'Python',
            id: 71,
            highlighter: python
        },
        {
            name: 'JavaScript',
            id: 63,
            highlighter: javascript
        }
    ]

    // send data to server
    const submit = async () => {

        // Validate input
        if (document.getElementById('username').value === "" || document.getElementById('username').value.length < 3) {
            setValidationErrors({ username: "Username is required having a minimum three characters." });
            return;
        }
        else {
            setValidationErrors({});
        }

        // send data to server
        const post = await fetch("https://code-vault.azurewebsites.net/record", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors',
            referrerPolicy: "origin-when-cross-origin",
            body: JSON.stringify({
                sourceCode: codeData,
                codeLanguage: languages[lang].name,
                id: languages[lang].id,
                input: document.getElementById('stdin').value || "No input",
                username: document.getElementById('username').value,
            })
        });

        const out = await post.json();
        if (out.success === false) {
            swal("Error", out.message, "error");
        }
        else {
            router.push('/submissions');
        }
    }

    return (
        <div className="d-flex flex-column text-bg-light align-items-center main">

            <div className="mt-4 d-flex flex-row w-100 px-5 gap-5">

                {/* Input */}
                <div className="d-flex flex-column w-25 gap-4">
                    <div className="d-flex flex-column">
                        <label htmlFor="lang" className="form-label">Language: </label>
                        <select className="form-select" id="lang" onChange={(e) => { setLang(e.target.value) }} value={lang}>
                            {
                                languages.map((lang, index) => {
                                    return <option key={index} value={index}>{lang.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="d-flex flex-column">
                        <label htmlFor="username" className="form-label">Username: </label>
                        <input type="text" className="form-control" id="username" placeholder="Enter your username" />
                        <div className="text-danger">{validationErrors.username}</div>
                    </div>
                    <div className="d-flex flex-column">
                        <label htmlFor="stdin" className="form-label">Input: </label>
                        <textarea className="form-control" id="stdin" rows="3" placeholder="Enter your input here"></textarea>
                    </div>
                    <button className="btn btn-primary d-flex flex-row align-items-center" onClick={submit} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
                            <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z" />
                        </svg>
                        Submit
                    </button>
                </div>

                {/* Code Editor */}
                <div className='d-flex w-75 flex-column'>
                    <label htmlFor="stdin" className="form-label">Code Editor</label>
                    <CodeMirror
                        value={codeData}
                        height="750px"
                        className="form-control"
                        extensions={[languages[lang].highlighter()]}
                        onChange={(e) => { setCodeData(e) }}
                        theme={githubDark}
                    />
                </div>
            </div>
        </div>
    );
}
