import {
  ChangeEvent,
  DragEvent,
  useState
} from "react";

import { useDispatch } from "react-redux";

import { AppDispatch } from "../app/store";

import {
  setTransactions
} from "../features/transactions/transactionsSlice";

import {
  parseTransactions
} from "../lib/csvParser";

function UploadScreen() {
  const dispatch =
    useDispatch<AppDispatch>();

  const [
    isDragging,
    setIsDragging
  ] = useState(false);

  const [
    error,
    setError
  ] = useState<string | null>(null);

  const processFile = async (
    file: File
  ) => {
    setError(null);

    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      setError(
        "Please upload a CSV file."
      );

      return;
    }

    try {
      const transactions =
        await parseTransactions(
          file
        );

      dispatch(
        setTransactions(
          transactions
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to process the CSV."
      );
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (file) {
      void processFile(file);
    }
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setIsDragging(false);

    const file =
      event.dataTransfer.files[0];

    if (file) {
      void processFile(file);
    }
  };

  return (
    <main className="upload-page">
      <section className="upload-container">
        <div className="brand">
          <span className="brand-mark">
            S
          </span>

          <span>SubTrack</span>
        </div>

        <div className="upload-copy">
          <p className="eyebrow">
            PRIVATE BY DESIGN
          </p>

          <h1>
            Find the subscriptions
            hiding in your spending.
          </h1>

          <p>
            Upload your bank CSV and
            SubTrack will identify
            recurring charges,
            monthly costs and price
            increases.
          </p>
        </div>

        <div
          className={`drop-zone ${
            isDragging
              ? "drop-zone-active"
              : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() =>
            setIsDragging(false)
          }
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            ↑
          </div>

          <h2>
            Drop your CSV here
          </h2>

          <p>
            or choose a file from
            your computer
          </p>

          <label
            className="upload-button"
            htmlFor="csv-upload"
          >
            Choose CSV
          </label>

          <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <p className="privacy-note">
          Your data stays in your browser.
          Nothing is uploaded to a server.
        </p>
      </section>
    </main>
  );
}

export default UploadScreen;