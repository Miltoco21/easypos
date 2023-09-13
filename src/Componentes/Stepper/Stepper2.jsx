/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import Step1Component from "./Step1Component"; // Import your custom components for each step
import Step2Component from "./Step2Component";
import Step3Component from "./Step3Component";
import Step4Component from "./Step4Component";
import Step5Component from "./Step5Component";
// import Step6Component from "./Step6Component";
// import Step7Component from "./Step7Component";

const App = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    // Handle form submission here
  };

  const steps = [
    { label: "Paso 1" },
    { label: "Paso 2" },
    { label: "Paso 3" },
    { label: "Paso 4" },
    { label: "Paso 5" },
    { label: "Paso 6" },
    { label: "Paso 7" },
  ];

  // Define an array of step components
  const stepComponents = [
    <Step1Component />,
    <Step2Component />,
    <Step3Component />,
    <Step4Component />,
    <Step5Component />,
    // <Step6Component />,
    // <Step7Component />,
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px', width: '60vw',height: '80%' }}>
        <Typography variant="subtitle2" align="right">
          Paso actual: {activeStep + 1}
        </Typography>
      </Paper>

      <Stepper activeStep={activeStep} alternativeLabel style={{ width: '80%',height: '80%' }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div style={{ width: '80%', marginTop: '16px' ,}}>
        {stepComponents[activeStep]} {/* Render the current step component */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Volver
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default App;
