import { VariantProps, cva } from "class-variance-authority";
import { IconType } from "react-icons/lib";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { CountUp } from "@/components/count-app";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";


const boxVariant = cva(
	"shrink-0 rounded-md p-3",
	{
		variants: {
			variant: {
				default: "bg-blue-500/20",
				success: "bg-emerald-500/20",
				danger: "bg-rose-500/20",
				warning: "bg-yellow-500/20",
			},
		},
		defaultVariants: {
			variant: "default",
		}
	},
);

const iconVariant = cva(
	"size-6",
	{
		variants: {
			variant: {
				default: "fill-blue-500",
				success: "fill-emerald-500",
				danger: "fill-rose-500",
				warning: "fill-yellow-500",
			},
		},
		defaultVariants: {
			variant: "default",
		}
	},
);

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {
	title: string;
	value?: number;
	percentageChange?: number;
	dateRange: string;
	icon: IconType;
};

export const DataCard = ({ title, variant, value = 0, percentageChange = 0, dateRange, icon: Icon }: DataCardProps) => {
	return (
		<Card className="border-none drop-shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between gap-x-4">
				<div className="space-y-2">
					<CardTitle className="text-xl line-clamp-1"> {title}</CardTitle>
					<CardDescription className="line-clamp-1">
						{dateRange}
					</CardDescription>
				</div>
				<div className={cn(boxVariant({ variant }))}>
					<Icon className={cn(iconVariant({ variant }))} />
				</div>
			</CardHeader>
			<CardContent>
				<h1 className="font-bold text-2xl break-all mb-2 line-clamp-1">
					<CountUp
						preserveValue
						start={0}
						end={value}
						decimals={2}
						decimalPlaces={2}
						formattingFn={formatCurrency}
					/>
				</h1>
				<p className={cn(
					"text-muted-foreground text-sm line-clamp-1",
					percentageChange > 0 && "text-emerald-500",
					percentageChange < 0 && "text-rose-500",
				)}>
					{formatPercentage(percentageChange, { addPrefix: true })} from last period
				</p>
			</CardContent>
		</Card>
	)
}

export const DataCardLoading = () => {
	return (
		<Card className="border-none drop-shadow-sm h-[192px]">
			<CardHeader className="flex flex-row items-center justify-between gap-x-4">
				<div className="space-y-2">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-4 w-40" />
				</div>
				<Skeleton className="size-12" />
			</CardHeader>
			<CardContent>
				<Skeleton className="shrink-0 h-10 w-24 mb-2" />
				<Skeleton className="shrink-0 h-4 w-40" />
			</CardContent>
		</Card>
	)
}
