"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { githubLight } from "@uiw/codemirror-theme-github";
import {javascript} from "@codemirror/lang-javascript";

export default function Home() {

    const [data, setData] = useState({});
    const router = useRouter();

    // Fetch data from local storage
    useEffect(() => {
        if (localStorage.getItem('data') !== null) {
            setData(JSON.parse(localStorage.getItem('data')));
        }
        else {
            router.push('/submissions');
        }
    }, []);

    return (
        <div className="container d-flex flex-column mt-5">
            <h6 className='p mb-1'><strong>Username :</strong> {data.username}</h6>
            <h6 className='p mb-1'><strong>Language :</strong> {data.codeLanguage}</h6>
            <h6 className='p mb-1'><strong>Input :</strong> {data.input}</h6>
            <h6 className='p mb-1'><strong>Output:</strong> {data.output}</h6>
            <h6 className='p mb-3'><strong>Date :</strong> {data.date}</h6>
            <h6 className='p mb-1'><strong>Source Code</strong></h6>
            <CodeMirror
                value={data.sourceCode}
                theme={githubLight}
                readOnly={true}
                extensions={[javascript()]}
            />
        </div>
    );
}