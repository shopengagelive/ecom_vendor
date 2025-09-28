import React from "react";
import Card from "../ui/Card";
import { Play, Video } from "lucide-react";
import { EmptyStateProps } from "./types";

export default function EmptyState({ activeTab, reelsCount }: EmptyStateProps) {
  if (activeTab === "reels" && reelsCount === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Video className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reels found
          </h3>
          <p className="text-gray-500">
            No reels have been created from your live streams yet.
          </p>
        </div>
      </Card>
    );
  }

  if (activeTab !== "reels") {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Play className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} streams
          </h3>
          <p className="text-gray-500">
            {activeTab === "ongoing" && "No streams are currently live."}
            {activeTab === "upcoming" && "No upcoming streams scheduled."}
            {activeTab === "completed" && "No completed streams found."}
          </p>
        </div>
      </Card>
    );
  }

  return null;
}
