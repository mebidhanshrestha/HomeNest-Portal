import { Box, Grid2, Skeleton, Stack } from "@mui/material";
import { SectionCard } from "./SectionCard";

const BreadcrumbSkeleton = ({ withAction = false }: { withAction?: boolean }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
    }}
  >
    <Skeleton variant="rounded" width="100%" height={52} />
    {withAction ? <Skeleton variant="rounded" width={148} height={40} /> : null}
  </Box>
);

const StatCardSkeleton = () => (
  <SectionCard contentSx={{ p: 0 }} sx={{ height: "100%" }}>
    <Stack spacing={2} sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={1}>
          <Skeleton variant="text" width={96} height={18} />
          <Skeleton variant="text" width={112} height={46} />
        </Stack>
        <Skeleton variant="rounded" width={44} height={44} />
      </Stack>
      <Stack spacing={0.75}>
        <Skeleton variant="text" width="82%" />
        <Skeleton variant="text" width="60%" />
      </Stack>
    </Stack>
  </SectionCard>
);

export const DashboardPageSkeleton = () => (
  <Stack spacing={4}>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: { xs: "flex-start", lg: "center" },
        justifyContent: "space-between",
        gap: 2.5,
        px: { xs: 2.5, md: 4 },
        py: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={1} sx={{ minWidth: 0, width: "100%" }}>
        <Skeleton variant="text" width={116} height={22} />
        <Skeleton variant="text" width="46%" height={60} />
      </Stack>
      <Skeleton variant="text" width={120} height={28} />
    </Box>

    <Grid2 container spacing={3}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid2 key={index} size={{ xs: 12, md: 6, xl: 3 }}>
          <StatCardSkeleton />
        </Grid2>
      ))}
    </Grid2>

    <Grid2 container spacing={3}>
      {Array.from({ length: 2 }).map((_, index) => (
        <Grid2 key={index} size={{ xs: 12, xl: 6 }}>
          <SectionCard>
            <Stack spacing={2}>
              <Skeleton variant="text" width={160} height={34} />
              <Skeleton variant="text" width="52%" />
              <Skeleton variant="text" width="52%" />
              <Skeleton variant="rounded" width="100%" height={280} />
              <Skeleton variant="text" width="74%" />
            </Stack>
          </SectionCard>
        </Grid2>
      ))}
    </Grid2>
  </Stack>
);

export const PropertyListSkeleton = () => (
  <Stack spacing={4}>
    <BreadcrumbSkeleton withAction />
    <PropertyFiltersSkeleton />
    <SectionCard title="Property list" description="All currently available properties are listed here.">
      <PropertyGridSkeleton />
    </SectionCard>
  </Stack>
);

export const PropertyFiltersSkeleton = () => (
  <SectionCard contentSx={{ p: { xs: 2, md: 2.5 } }}>
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: "column", xl: "row" }}
        spacing={2}
        alignItems={{ xl: "center" }}
        justifyContent="space-between"
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ sm: "center" }}
          sx={{ width: { xs: "100%", xl: "auto" }, flexWrap: "wrap" }}
        >
          <Skeleton variant="rounded" width={240} height={40} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Skeleton variant="rounded" width={38} height={24} />
            <Skeleton variant="text" width={84} height={24} />
          </Box>
          <Skeleton variant="circular" width={34} height={34} />
        </Stack>
        <Skeleton variant="rounded" width={230} height={40} />
      </Stack>
    </Stack>
  </SectionCard>
);

export const PropertyGridSkeleton = () => (
  <Stack spacing={3}>
    <Grid2 container spacing={3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid2 key={index} size={{ xs: 12, md: 6, xl: 4 }}>
          <SectionCard contentSx={{ p: 0 }} sx={{ overflow: "hidden" }}>
            <Skeleton variant="rectangular" width="100%" height={220} />
            <Stack spacing={2} sx={{ p: 2.5 }}>
              <Stack spacing={0.75}>
                <Skeleton variant="text" width="58%" height={34} />
                <Skeleton variant="text" width="34%" />
              </Stack>
              <Skeleton variant="text" width="42%" height={36} />
              <Stack direction="row" spacing={1.5}>
                <Skeleton variant="rounded" width="100%" height={42} />
                <Skeleton variant="rounded" width="100%" height={42} />
              </Stack>
            </Stack>
          </SectionCard>
        </Grid2>
      ))}
    </Grid2>
    <Skeleton variant="rounded" width="100%" height={48} />
  </Stack>
);

export const SavedHomesPageSkeleton = () => (
  <Stack spacing={4}>
    <BreadcrumbSkeleton />
    <SectionCard title="Saved homes" description="Everything you have shortlisted appears here.">
      <SavedHomesContentSkeleton />
    </SectionCard>
  </Stack>
);

export const SavedHomesContentSkeleton = () => (
  <Stack spacing={2}>
    {Array.from({ length: 3 }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Skeleton variant="rounded" width={72} height={72} />
        <Stack spacing={0.75} sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="32%" height={30} />
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="24%" />
        </Stack>
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
    ))}
  </Stack>
);

export const AccountPageSkeleton = () => (
  <Stack spacing={4}>
    <BreadcrumbSkeleton withAction />
    <SectionCard title="Account details" description="Your current account information.">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }}>
        <Skeleton variant="circular" width={84} height={84} />
        <Stack spacing={1.25} sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="28%" height={34} />
          <Skeleton variant="text" width="36%" height={28} />
        </Stack>
      </Stack>
    </SectionCard>
    <SectionCard title="Change password" description="Update your password for this account.">
      <Stack spacing={2}>
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={44} />
      </Stack>
    </SectionCard>
  </Stack>
);

export const PropertyDetailSkeleton = () => (
  <Stack spacing={4}>
    <BreadcrumbSkeleton withAction />
    <SectionCard>
      <Skeleton variant="rounded" width="100%" height={420} />
    </SectionCard>
    <SectionCard title="Property detail" description="Core information for this property listing.">
      <Stack spacing={2}>
        <Skeleton variant="text" width="44%" height={44} />
        <Skeleton variant="text" width="22%" />
        <Skeleton variant="text" width="26%" />
        <Skeleton variant="text" width="34%" />
        <Skeleton variant="text" width="24%" height={38} />
      </Stack>
    </SectionCard>
  </Stack>
);

export const PropertyEditSkeleton = () => (
  <Stack spacing={4}>
    <BreadcrumbSkeleton withAction />
    <PropertyEditFormSkeleton />
  </Stack>
);

export const PropertyEditFormSkeleton = () => (
  <SectionCard title="Property details" description="Adjust the listing information and save your changes.">
    <Stack spacing={2}>
      <Skeleton variant="rounded" width="100%" height={56} />
      <Skeleton variant="rounded" width="100%" height={56} />
      <Skeleton variant="rounded" width="100%" height={56} />
      <Skeleton variant="rounded" width="100%" height={56} />
      <Skeleton variant="rounded" width={160} height={44} />
    </Stack>
  </SectionCard>
);
