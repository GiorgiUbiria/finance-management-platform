"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateRange } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export const DateFilter = () => {
	const router = useRouter();
	const pathName = usePathname();

	const params = useSearchParams();
	const accountId = params.get("accountId");
	const from = params.get("from") || "";
	const to = params.get("to") || "";

	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	const paramState = {
		from: from ? new Date(from) : defaultFrom,
		to: to ? new Date(to) : defaultTo,
	}

	const [date, setDate] = useState<DateRange | undefined>(paramState);

	const pushToUrl = (dateRange: DateRange | undefined) => {
		const query = {
			from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
			to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
			accountId,
		};

		const url = qs.stringifyUrl({
			url: pathName,
			query,
		}, { skipEmptyString: true, skipNull: true })

		router.push(url)
	}

	const onReset = () => {
		setDate(undefined);
		pushToUrl(undefined);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					disabled={false}
					size="sm"
					variant="outline"
					className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
				>
					<span>{formatDateRange(paramState)}</span>
					<ChevronDown className="ml-2 size-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0 lg:w-auto w-full" align="start">
				<Calendar
					disabled={false}
					mode="range"
					initialFocus
					defaultMonth={date?.from}
					selected={date}
					onSelect={setDate}
					numberOfMonths={2}
				/>
				<div className="p-4 w-full flex items-center gap-x-2">
					<PopoverClose asChild>
						<Button
							onClick={onReset}
							disabled={!date?.from || !date?.to}
							className="w-full"
							variant="outline"
						>
							Reset
						</Button>
					</PopoverClose>
					<PopoverClose asChild>
						<Button
							onClick={() => pushToUrl(date)}
							disabled={!date?.from || !date?.to}
							className="w-full"
						>
							Apply
						</Button>
					</PopoverClose>
				</div>
			</PopoverContent>
		</Popover>
	)
}

