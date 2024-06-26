import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = "https://file-sharing-app-zphz.onrender.com";
      const res = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded successfully');
      // Ensure the URL uses HTTPS
      const secureFileUrl = res.data.fileUrl.replace('http://', 'https://');
      setFileUrl(secureFileUrl);
    } catch (err) {
      console.error(err);
      setMessage('File upload failed');
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      <p>{message}</p>
      {fileUrl && (
        <p>
          File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
