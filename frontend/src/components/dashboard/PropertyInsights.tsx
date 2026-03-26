import { Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SectionCard } from "../ui/SectionCard";

type PropertyInsightsProps = {
  totalProperties: number;
  favouriteCount: number;
  cityCount: number;
  averagePriceLabel: string;
};

export const PropertyInsights = ({
  totalProperties,
  favouriteCount,
  cityCount,
  averagePriceLabel,
}: PropertyInsightsProps) => (
  <SectionCard
    title="Portfolio snapshot"
    description="Catalogue totals and shortlist progress."
  >
    <Stack spacing={1.25}>
      {[
        { label: "Total listings", value: totalProperties.toString() },
        { label: "Saved homes", value: favouriteCount.toString() },
        { label: "Active cities", value: cityCount.toString() },
        { label: "Average price", value: averagePriceLabel },
      ].map((item) => (
        <Stack
          key={item.label}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={(theme) => ({
            px: 1.75,
            py: 1.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.08),
            backgroundColor: alpha(theme.palette.primary.main, 0.035),
          })}
        >
          <Typography color="text.secondary">{item.label}</Typography>
          <Typography variant="h6">{item.value}</Typography>
        </Stack>
      ))}
    </Stack>
  </SectionCard>
);
