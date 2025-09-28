import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { BankDetails } from "./types";

interface PaymentTabProps {
  bankDetails: BankDetails;
  onBankDetailsChange: (details: BankDetails) => void;
  onSave: () => void;
}

export default function PaymentTab({
  bankDetails,
  onBankDetailsChange,
  onSave,
}: PaymentTabProps) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Bank Account Details
        </h3>
        <p className="text-sm text-gray-600">
          Add your bank account information for payments.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              value={bankDetails.accountHolderName}
              onChange={(e) =>
                onBankDetailsChange({
                  ...bankDetails,
                  accountHolderName: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={(e) =>
                onBankDetailsChange({
                  ...bankDetails,
                  accountNumber: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              value={bankDetails.ifscCode}
              onChange={(e) =>
                onBankDetailsChange({
                  ...bankDetails,
                  ifscCode: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={bankDetails.bankName}
              onChange={(e) =>
                onBankDetailsChange({
                  ...bankDetails,
                  bankName: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Branch Name
            </label>
            <input
              type="text"
              value={bankDetails.branchName}
              onChange={(e) =>
                onBankDetailsChange({
                  ...bankDetails,
                  branchName: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        <Button onClick={onSave}>Save Bank Details</Button>
      </div>
    </Card>
  );
}
