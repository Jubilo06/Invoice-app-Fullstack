import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ErrorOutlineRounded as ErrorIcon,
  HomeRounded as HomeIcon,
  ArrowBackRounded as ArrowBackIcon,
  ContentCopyRounded as CopyIcon,
  CheckRounded as CheckIcon,
  ReceiptLongRounded as InvoiceIcon,
  AddCircleOutlineRounded as AddIcon,
  AccountCircleRounded as ProfileIcon,
  BugReportRounded as BugIcon,
  ExpandMoreRounded as ExpandMoreIcon,
} from "@mui/icons-material";

export default function ErrorPage({
  status: propStatus,
  title: propTitle,
  message: propMessage,
  error: propError,
  resetErrorBoundary,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Safely extract error details from props or navigation state
  const stateError = location?.state?.error;
  const stateStatus = location?.state?.status;
  const stateMessage = location?.state?.message;

  const errorObj = propError || stateError || null;
  const statusCode = propStatus || stateStatus || (errorObj?.status ?? 404);

  // Determine user-friendly title and message
  let errorTitle = propTitle || stateMessage || "Page Not Found";
  let errorMessage =
    propMessage ||
    "The page or invoice document you are looking for doesn't exist, has been moved, or the link is invalid.";

  if (statusCode === 500) {
    errorTitle = propTitle || "Internal Application Error";
    errorMessage =
      propMessage ||
      "Something unexpected happened on our end while rendering this view. Our team has been alerted.";
  } else if (statusCode === 403) {
    errorTitle = propTitle || "Access Denied";
    errorMessage =
      propMessage || "You do not have permission to view this invoice or workspace.";
  }

  // Diagnostics details for debugging
  const devDetails = errorObj
    ? errorObj.stack || errorObj.message || JSON.stringify(errorObj, null, 2)
    : null;

  const handleCopy = () => {
    if (devDetails) {
      navigator.clipboard.writeText(devDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/profile");
    }
  };

  const handleGoHome = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    navigate("/profile");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 8, md: 12 },
        px: 2,
        position: "relative",
        background: "linear-gradient(135deg, #090e1a 0%, #0d1527 50%, #0a1120 100%)",
        color: "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* Background Ambience Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 320, md: 620 },
          height: { xs: 320, md: 620 },
          borderRadius: "50%",
          background:
            statusCode === 404
              ? "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(60px)",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5, md: 6 },
            borderRadius: "24px",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            textAlign: "center",
          }}
        >
          {/* Status Badge */}
          <Chip
            icon={<ErrorIcon sx={{ fontSize: "1.1rem !important" }} />}
            label={statusCode === 404 ? "HTTP 404 • Missing Resource" : `Error Code • ${statusCode}`}
            sx={{
              fontWeight: 700,
              fontSize: "0.82rem",
              px: 1.5,
              py: 2,
              borderRadius: "100px",
              background:
                statusCode === 404
                  ? "rgba(59, 130, 246, 0.12)"
                  : "rgba(239, 68, 68, 0.12)",
              color: statusCode === 404 ? "#60a5fa" : "#f87171",
              border: `1px solid ${
                statusCode === 404 ? "rgba(59, 130, 246, 0.25)" : "rgba(239, 68, 68, 0.25)"
              }`,
              mb: 3,
            }}
          />

          {/* Giant Status Code */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "5.5rem", sm: "7.5rem", md: "9rem" },
              lineHeight: 1,
              letterSpacing: "-0.04em",
              background:
                statusCode === 404
                  ? "linear-gradient(180deg, #ffffff 30%, #38bdf8 100%)"
                  : "linear-gradient(180deg, #ffffff 30%, #f87171 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              userSelect: "none",
              mb: 2,
            }}
          >
            {statusCode}
          </Typography>

          {/* Error Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#ffffff",
              mb: 1.5,
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            {errorTitle}
          </Typography>

          {/* Descriptive Message */}
          <Typography
            variant="body1"
            sx={{
              color: "#94a3b8",
              maxWidth: 540,
              mx: "auto",
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              lineHeight: 1.6,
              mb: 4.5,
            }}
          >
            {errorMessage}
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              mb: 5,
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "12px",
                px: 3.5,
                py: 1.4,
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                },
              }}
            >
              Back to Dashboard
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                color: "#e2e8f0",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "12px",
                px: 3,
                py: 1.4,
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  background: "rgba(255, 255, 255, 0.04)",
                },
              }}
            >
              Go to Previous Page
            </Button>
          </Box>

          {/* Quick Shortcuts */}
          <Box
            sx={{
              pt: 4,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#64748b",
                fontWeight: 700,
                display: "block",
                mb: 2,
              }}
            >
              FastBill Quick Links
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              {[
                { label: "My Invoices", icon: <InvoiceIcon fontSize="small" />, path: "/profile" },
                { label: "New Document", icon: <AddIcon fontSize="small" />, path: "/invoice-editor" },
                { label: "Company Settings", icon: <ProfileIcon fontSize="small" />, path: "/invoice" },
              ].map((link, idx) => (
                <Grid item xs={12} sm={4} key={idx}>
                  <Paper
                    elevation={0}
                    onClick={() => navigate(link.path)}
                    sx={{
                      p: 1.8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.2,
                      cursor: "pointer",
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      color: "#cbd5e1",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.08)",
                        borderColor: "rgba(59, 130, 246, 0.4)",
                        color: "#60a5fa",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {link.icon}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {link.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Collapsible Diagnostic Console (Only appears if an error stack exists) */}
          {devDetails && (
            <Box sx={{ mt: 4, textAlign: "left" }}>
              <Accordion
                elevation={0}
                sx={{
                  background: "rgba(10, 15, 30, 0.9)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "12px !important",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#ef4444" }} />}
                  sx={{ px: 2 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BugIcon sx={{ color: "#ef4444", fontSize: "1.2rem" }} />
                    <Typography variant="body2" sx={{ color: "#fca5a5", fontWeight: 700 }}>
                      Developer Error Diagnostics
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "8px",
                      background: "#030712",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Tooltip title={copied ? "Copied!" : "Copy Details"}>
                      <IconButton
                        size="small"
                        onClick={handleCopy}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: copied ? "#22c55e" : "#94a3b8",
                          background: "rgba(255, 255, 255, 0.05)",
                          "&:hover": { background: "rgba(255, 255, 255, 0.15)" },
                        }}
                      >
                        {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Typography
                      component="pre"
                      sx={{
                        m: 0,
                        pr: 4,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontSize: "0.78rem",
                        color: "#ef4444",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        lineHeight: 1.5,
                        maxHeight: "220px",
                        overflowY: "auto",
                      }}
                    >
                      {devDetails}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}