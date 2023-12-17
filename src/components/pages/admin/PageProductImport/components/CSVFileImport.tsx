import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { AlertContext } from "~/contexts/AlertContext/AlertContext";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const { showAlert } = useContext(AlertContext)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };
  const uploadFile = async () => {
    console.log("uploadFile to", url);
    try {
      if (!file) return

      const authorization_token = localStorage.getItem('authorization_token')
      if (!authorization_token) {
        console.log("there is no 'authorization_token' in localStorage")
        return
      }

      // Get the presigned URL
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          "Authorization": `Basic ${authorization_token}`
        }
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error: any) {
      if (error?.response && (error?.response?.status === 401 || error?.response?.status === 403)) {
        showAlert(`File was not uploaded. Error message ${error.response.data?.message}`)
      }
    }

  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
