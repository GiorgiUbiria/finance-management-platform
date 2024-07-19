import { UploadIcon } from "lucide-react";
import { useCSVReader } from "react-papaparse";

import { Button } from "./ui/button";

type Props = {
  onUpload: (results: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button size="sm" className="w-full lg:w-auto" {...getRootProps()}>
          <UploadIcon className="mr-2 size-4" />
          Import
        </Button>
      )}
    </CSVReader>
  );
};
