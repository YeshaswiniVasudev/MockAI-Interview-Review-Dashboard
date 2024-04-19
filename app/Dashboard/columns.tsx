// Import necessary modules and components
import { ColumnDef } from "@tanstack/react-table";
import React, { Suspense, lazy } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import AudioPlayer from "@/components/audioPlayer";
import styles from "./Page.module.css";

// Define the type for a recording
export type recording = {
  id: number;
  title: string;
  duration: number;
  date: string;
  path: string;
  transcript: string;
};

// Define the columns for the table
export const columns: ColumnDef<recording>[] = [
  {
    // Column for the ID
    accessorKey: "id",
    header: "Id",
  },

  {
    // Column for the title
    accessorKey: "title",
    header: "Title",
  },
  {
    // Column for the date, with a custom header that includes a sorting button
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    // Column for the duration, with a custom cell that formats the duration
    accessorKey: "duration",
    header: "Duration",

    cell: (cellContext) => {
      const value = cellContext.row.original.duration;

      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;
      return <div> {`${hours}h ${minutes}m ${seconds}s`}</div>;
    },
  },
  {
    // Column for the audio file, with a custom cell that includes an audio player
    accessorKey: "path",
    header: "Audio File",
    cell: ({ row }) => (
      <div>
        <AudioPlayer path={row.original.path} />
      </div>
    ),
  },
  {
    // Column for actions, with a custom cell that includes a link to a detailed page
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/detailedPage/${row.original.id}`}>
        <Button className={styles["button-33"]}>Review Interview</Button>
      </Link>
    ),
  },
];
