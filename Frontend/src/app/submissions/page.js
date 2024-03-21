"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Home() {

    const [data, setData] = useState([]);
    const router = useRouter();

    // Fetch data from server
    const fetchData = async () => {
        const response = await fetch(`https://code-vault.azurewebsites.net/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            mode: 'cors',
            referrerPolicy: "origin-when-cross-origin",
        });
        const json = await response.json();
        setData(json.data);
    }

    // Cache data and redirect to view page
    const cacheData = async (e) => {
        localStorage.setItem('data', JSON.stringify(e));
        router.push('/submissions/view');
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-100 px-5 mt-5">
            <table className="table table-hover px-5 border rounded-4">
                <thead className='table-dark'>
                    <tr>
                        <th scope="col">S.no</th>
                        <th scope="col">Date</th>
                        <th scope="col">Username</th>
                        <th scope="col">Language</th>
                        <th scope="col">Source Code</th>
                        <th scope="col">Input</th>
                        <th scope="col">Output</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {

                        const date = new Date(item.date);
                        item.date = date.toDateString() + ", " + date.toLocaleTimeString();

                        return (
                            <tr key={index} onClick={() => { cacheData(item) }} className='pointer'>
                                <th scope="row">{index + 1}</th>
                                <td>{item.date}</td>
                                <td>{item.username}</td>
                                <td>{item.codeLanguage}</td>
                                <td>{item.sourceCode.length > 100 ? item.sourceCode.substring(0, 100) + "..." : item.sourceCode}</td>
                                <td>{item.input}</td>
                                <td>{item.output}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
