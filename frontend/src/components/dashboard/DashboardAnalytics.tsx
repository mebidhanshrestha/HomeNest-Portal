import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Grid2, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { SectionCard } from "../ui/SectionCard";
import type { Property } from "../../types";

type DashboardAnalyticsProps = {
  properties: Property[];
  favouriteCount: number;
};

export const DashboardAnalytics = ({
  properties,
  favouriteCount,
}: DashboardAnalyticsProps) => {
  const theme = useTheme();

  const citySeries = useMemo(() => {
    const counts = new Map<string, number>();

    properties.forEach((property) => {
      counts.set(property.city, (counts.get(property.city) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 6);
  }, [properties]);

  const priceSeries = useMemo(
    () =>
      [...properties]
        .sort((left, right) => left.price - right.price)
        .map((property) => ({
          x: property.title,
          y: property.price,
        })),
    [properties],
  );

  const cityChartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        toolbar: { show: false },
        sparkline: { enabled: false },
        fontFamily: theme.typography.fontFamily,
        foreColor: theme.palette.text.secondary,
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "42%",
        },
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: {
        borderColor: alpha(theme.palette.divider, 0.65),
        strokeDashArray: 4,
      },
      xaxis: {
        categories: citySeries.map(([city]) => city),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: citySeries.map(() => theme.palette.text.secondary),
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        tickAmount: 4,
        min: 0,
        labels: {
          style: {
            colors: [theme.palette.text.secondary],
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: theme.palette.mode,
      },
      colors: [theme.palette.primary.main],
    }),
    [citySeries, theme],
  );

  const priceChartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        toolbar: { show: false },
        fontFamily: theme.typography.fontFamily,
        foreColor: theme.palette.text.secondary,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      dataLabels: { enabled: false },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.28,
          opacityTo: 0.04,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: alpha(theme.palette.divider, 0.65),
        strokeDashArray: 4,
      },
      xaxis: {
        categories: priceSeries.map((item) => item.x),
        labels: {
          show: false,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value) => `NPR ${Number(value).toLocaleString("en-US")}`,
          style: {
            colors: [theme.palette.text.secondary],
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (value) => `NPR ${Number(value).toLocaleString("en-US")}`,
        },
      },
      markers: {
        size: 4,
        strokeWidth: 0,
      },
      colors: [theme.palette.secondary.main],
    }),
    [priceSeries, theme],
  );

  const savedRatio = properties.length > 0 ? Math.round((favouriteCount / properties.length) * 100) : 0;

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{ xs: 12, xl: 6 }}>
        <SectionCard
          title="City distribution"
          description="Where the current catalogue is concentrated."
          sx={{ height: "100%" }}
        >
          <Stack spacing={2}>
            <Chart
              type="bar"
              height={280}
              series={[
                {
                  name: "Listings",
                  data: citySeries.map(([, count]) => count),
                },
              ]}
              options={cityChartOptions}
            />
            <Typography variant="body2" color="text.secondary">
              {citySeries.length > 0
                ? `${citySeries[0][0]} currently has the highest listing count.`
                : "Add more properties to see city-level distribution."}
            </Typography>
          </Stack>
        </SectionCard>
      </Grid2>

      <Grid2 size={{ xs: 12, xl: 6 }}>
        <SectionCard
          title="Price analytics"
          description="Pricing spread across the current catalogue."
          sx={{ height: "100%" }}
        >
          <Stack spacing={2.5}>
            <Chart
              type="area"
              height={280}
              series={[
                {
                  name: "Price",
                  data: priceSeries.map((item) => item.y),
                },
              ]}
              options={priceChartOptions}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              useFlexGap
              flexWrap="wrap"
            >
              <Typography variant="body2" color="text.secondary">
                Lowest:{" "}
                <Typography component="span" color="text.primary" fontWeight={600}>
                  {priceSeries.length > 0
                    ? `NPR ${priceSeries[0].y.toLocaleString("en-US")}`
                    : "NPR 0"}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highest:{" "}
                <Typography component="span" color="text.primary" fontWeight={600}>
                  {priceSeries.length > 0
                    ? `NPR ${priceSeries[priceSeries.length - 1].y.toLocaleString("en-US")}`
                    : "NPR 0"}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Saved ratio:{" "}
                <Typography component="span" color="text.primary" fontWeight={600}>
                  {savedRatio}%
                </Typography>
              </Typography>
            </Stack>
          </Stack>
        </SectionCard>
      </Grid2>
    </Grid2>
  );
};
