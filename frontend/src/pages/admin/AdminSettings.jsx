import React, { useState } from "react";
import Breadcrumbs from "../../components/shared/Breadcrumbs";
import { Switch } from "@headlessui/react";

const AdminSettings = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div className="p-6">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Settings</h1>

      {/* System Preferences */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">🛠️ System Preferences</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Enable Email Notifications</span>
            <Switch
              checked={emailNotif}
              onChange={setEmailNotif}
              className={`${emailNotif ? "bg-green-500" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${emailNotif ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          <div className="flex justify-between items-center">
            <span>Enable SMS Notifications</span>
            <Switch
              checked={smsNotif}
              onChange={setSmsNotif}
              className={`${smsNotif ? "bg-green-500" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${smsNotif ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          <div className="flex justify-between items-center">
            <span>Enable Auto Data Backup</span>
            <Switch
              checked={autoBackup}
              onChange={setAutoBackup}
              className={`${autoBackup ? "bg-green-500" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${autoBackup ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">🧹 Data Management</h2>
        <p className="text-sm text-gray-600 mb-4">
          Perform high-level data operations with caution. These actions cannot be undone.
        </p>

        <div className="space-y-4">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Delete All Inactive Employees
          </button>

          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Export Employee Data
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Trigger Manual Backup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
