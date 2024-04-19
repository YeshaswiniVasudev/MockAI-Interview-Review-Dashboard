import { ColumnDef } from "@tanstack/react-table";
import React, { Suspense, lazy } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import AudioPlayer from "@/components/audioPlayer";
import styles from "./Page.module.css";

export type recording = {
  id: number;
  title: string;
  duration: number;
  date: string;
  path: string;
};

export const columns: ColumnDef<recording>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },

  {
    accessorKey: "title",
    header: "Title",
  },
  {
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
    accessorKey: "duration",
    header: "Duration",
    // header: ({ column }) => {
    //   return (
    //     <div>
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Duration
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     </div>
    //   );
    // },
    cell: (cellContext) => {
      const value = cellContext.row.original.duration;
      // Example: converting seconds to a more readable format
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;
      return (
        <div >
          {" "}
          {/* Tailwind CSS class for centering text */}
          {`${hours}h ${minutes}m ${seconds}s`}
        </div>
      );
    },
    // meta: {
    //   align: 'right'
    // },
  },
  {
    accessorKey: "path",
    header: "Audio File",
    cell: ({ row }) => (
      //   <div>
      //     <audio controls>
      //       <source src={row.original.path} type="audio/wav" />
      //       Your browser does not support the audio element.
      //     </audio>
      //   </div>
      <div>
        <AudioPlayer path={row.original.path} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/detailedPage/${row.original.id}`}>
        <Button className={styles["button-33"]}>Review Interview</Button>
      </Link>
    ),
  },
];
