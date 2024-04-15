
import { ColumnDef } from "@tanstack/react-table";
import React, { Suspense, lazy } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import AudioPlayer from "@/components/audioPlayer"; 

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
        )
      },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Duration
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
        <Button >Go to Details</Button>
      </Link>
    ),
  },
];
