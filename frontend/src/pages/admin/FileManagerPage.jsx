import React from "react";
import Breadcrumbs from "../../components/shared/Breadcrumbs";
import FileManager from "./FileManager";

const FileManagerPage = () => {
  return (
    <div className="p-6">
      <Breadcrumbs />
      <h1 className="text-xl font-semibold mb-4">Document Management</h1>
      <FileManager />
    </div>
  );
};

export default FileManagerPage;
