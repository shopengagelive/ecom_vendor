import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import Button from "../ui/Button";
import { Edit, Trash2, Settings } from "lucide-react";
import { StaffTableProps } from "./types";

export default function StaffTable({
  staffList,
  onEditStaff,
  onDeleteStaff,
  onManagePermissions,
}: StaffTableProps) {
  const getStatusVariant = (status: "Active" | "Inactive") => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <Table headers={["Avatar", "Name", "Email", "Role", "Status", "Actions"]}>
        {staffList.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell>
              <img
                src={
                  typeof staff.avatar === "string"
                    ? staff.avatar
                    : staff.avatar
                    ? URL.createObjectURL(staff.avatar as File)
                    : ""
                }
                alt={staff.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
            </TableCell>
            <TableCell className="font-medium">{staff.name}</TableCell>
            <TableCell>{staff.email}</TableCell>
            <TableCell>{staff.role}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(staff.status)}>
                {staff.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Settings}
                  aria-label="Manage Permissions"
                  onClick={() => onManagePermissions(staff)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Manage
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  aria-label="Edit"
                  onClick={() => onEditStaff(staff)}
                >
                  {""}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  aria-label="Delete"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteStaff(staff)}
                >
                  {""}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </Card>
  );
}
