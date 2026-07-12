"use client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

type DateInputProps = {
  label?: string;
  placeholder?: string;
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
};

export default function DateInput({
  label,
  placeholder,
  value,
  onChange,
}: DateInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sab-gray-500 font-medium">{label}</label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value}
          onChange={(newValue) => {
            if (onChange) {
              onChange(newValue);
            }
          }}
          format="DD MMMM YYYY"
          slots={{
            openPickerIcon: () => <CalendarDays size={18} />,
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",

              sx: {
                "& .MuiPickersOutlinedInput-root": {
                  borderRadius: "50px",
                  backgroundColor: "#FFFFFF",
                  height: "40px",
                },

                "& .MuiPickersOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary) !important",
                  borderWidth: "2px",
                },

                "&:hover .MuiPickersOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary) !important",
                },

                "& .Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary) !important",
                },

                "& input": {
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-sab-gray-500)",
                },

                "& svg": {
                  color: "var(--color-secondary)",
                },
              },
            },
            field: {
              clearable: true,
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}