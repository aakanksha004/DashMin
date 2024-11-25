import React from "react";
import { Edit, Delete } from "@mui/icons-material";

const PermissionTable = ({ permissions, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
    <table className="min-w-full w-full border-collapse border border-gray-200 bg-white shadow-md rounded-md text-sm sm:text-base">
      <thead>
        <tr className="bg-teal-700 text-white">
          <th className="p-2 sm:p-3 text-center w-1/3">Permission</th>
          <th className="p-2 sm:p-3 text-center w-1/3">Description</th>
          <th className="p-2 sm:p-3 text-center w-1/3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {permissions.map((permission) => (
          <tr
            key={permission.id}
            className="border-b hover:bg-gray-100 transition-colors"
          >
            <td className="p-2 sm:p-3 text-center">{permission.name}</td>
            <td className="p-2 sm:p-3 text-center">{permission.description}</td>
            <td className="p-2 sm:p-3 text-center">
              <div className="flex justify-center gap-1 sm:gap-2">
                <button
                  onClick={() => onEdit(permission)}
                  className="text-teal-500 p-1 sm:p-2 rounded hover:bg-blue-200"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => onDelete(permission.id)}
                  className="text-red-500 p-1 sm:p-2 rounded hover:bg-red-200"
                >
                  <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default PermissionTable;
