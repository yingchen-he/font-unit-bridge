// script.js

// --- Conversion Constants ---
const MM_PER_INCH = 25.4; // 1 inch = 25.4 mm
const PT_PER_INCH = 72; // 1 inch = 72 pt
const PT_PER_PC = 12; // 1 pc = 12 pt
const MIN_PER_DEG = 60;
const SEC_PER_MIN = 60;

// --- Core Conversion Functions (all to/from millimeters as central unit) ---

// Physical Length Conversions (to/from mm)
function mmToCm(mm) { return mm / 10; }
function cmToMm(cm) { return cm * 10; }
function mmToM(mm) { return mm / 1000; }
function mToMm(m) { return m * 1000; }
function mmToIn(mm) { return mm / MM_PER_INCH; }
function inToMm(inches) { return inches * MM_PER_INCH; }
function mmToFt(mm) { return mmToIn(mm) / 12; }
function ftToMm(feet) { return inToMm(feet * 12); }

// Design Conversions (to/from mm)
function mmToPt(mm) { return mmToIn(mm) * PT_PER_INCH; }
function ptToMm(points) { return points / PT_PER_INCH * MM_PER_INCH; }
function mmToPx(mm, ppi) {
    if (ppi === null || ppi === undefined || isNaN(ppi) || ppi <= 0) {
        throw new Error("PPI is required for pixel conversions.");
    }
    return mmToIn(mm) * ppi;
}
function pxToMm(pixels, ppi) {
    if (ppi === null || ppi === undefined || isNaN(ppi) || ppi <= 0) {
        throw new Error("PPI is required for pixel conversions.");
    }
    return (pixels / ppi) * MM_PER_INCH;
}
function mmToPc(mm) { return mmToPt(mm) / PT_PER_PC; }
function pcToMm(picas) { return ptToMm(picas * PT_PER_PC); }


// Visual Angle & Acuity Conversions (to/from mm, requiring viewingDistanceMm)
function degToMm(degrees, viewingDistanceMm) {
    if (viewingDistanceMm === null || viewingDistanceMm === undefined || isNaN(viewingDistanceMm) || viewingDistanceMm <= 0) {
        throw new Error("Viewing distance is required for visual angle conversions.");
    }
    const angleRadians = degrees * Math.PI / 180;
    return 2 * viewingDistanceMm * Math.tan(angleRadians / 2);
}
function minToMm(minutes, viewingDistanceMm) {
    return degToMm(minutes / MIN_PER_DEG, viewingDistanceMm);
}
function secToMm(seconds, viewingDistanceMm) {
    return minToMm(seconds / SEC_PER_MIN, viewingDistanceMm);
}

function mmToDeg(mm, viewingDistanceMm) {
    if (viewingDistanceMm === null || viewingDistanceMm === undefined || isNaN(viewingDistanceMm) || viewingDistanceMm <= 0) {
        throw new Error("Viewing distance is required for visual angle conversions.");
    }
    const angleRadians = 2 * Math.atan(mm / (2 * viewingDistanceMm));
    return angleRadians * 180 / Math.PI;
}
function mmToMin(mm, viewingDistanceMm) {
    return mmToDeg(mm, viewingDistanceMm) * MIN_PER_DEG;
}
function mmToSec(mm, viewingDistanceMm) {
    return mmToMin(mm, viewingDistanceMm) * SEC_PER_MIN;
}

// Acuity Conversions (to/from minutes of arc)
// Snellen 20/X to Minutes of Arc (MAR)
// 20/20 vision means 1 minute of arc (MAR) resolution
function snellenToMin(snellenX) {
    if (snellenX === null || snellenX === undefined || isNaN(snellenX) || snellenX <= 0) {
        throw new Error("Invalid Snellen X value.");
    }
    return snellenX / 20; // 20/X Snellen corresponds to X/20 MAR
}
function minToSnellen(minutes) {
    if (minutes === null || minutes === undefined || isNaN(minutes) || minutes <= 0) {
        throw new Error("Invalid minutes value for Snellen conversion.");
    }
    return 20 * minutes;
}

// LogMAR to Minutes of Arc (MAR)
function logmarToMin(logmar) {
    if (logmar === null || logmar === undefined || isNaN(logmar)) {
        throw new Error("Invalid LogMAR value.");
    }
    return Math.pow(10, logmar);
}
function minToLogmar(minutes) {
    if (minutes === null || minutes === undefined || isNaN(minutes) || minutes <= 0) {
        throw new Error("Invalid minutes value for LogMAR conversion.");
    }
    return Math.log10(minutes);
}

// Decimal Acuity to Minutes of Arc (MAR)
function decimalToMin(decimal) {
    if (decimal === null || decimal === undefined || isNaN(decimal) || decimal <= 0) {
        throw new Error("Invalid Decimal Acuity value.");
    }
    return 1 / decimal;
}
function minToDecimal(minutes) {
    if (minutes === null || minutes === undefined || isNaN(minutes) || minutes <= 0) {
        throw new Error("Invalid minutes value for Decimal Acuity conversion.");
    }
    return 1 / minutes;
}


// --- Main Conversion Logic ---

// This function takes a value in a specific unit and converts it to millimeters (mm)
function convertToMm(value, unit, ppi, viewingDistanceMm) {
    switch (unit) {
        case 'mm': return value;
        case 'cm': return cmToMm(value);
        case 'm': return mToMm(value);
        case 'in': return inToMm(value);
        case 'ft': return ftToMm(value);
        case 'pt': return ptToMm(value);
        case 'px': return pxToMm(value, ppi);
        case 'pc': return pcToMm(value);
        case 'deg': return degToMm(value, viewingDistanceMm);
        case 'min': return minToMm(value, viewingDistanceMm);
        case 'sec': return secToMm(value, viewingDistanceMm);
        case 'snellen': return minToMm(snellenToMin(value), viewingDistanceMm); // Snellen to MAR, then MAR to mm
        case 'logmar': return minToMm(logmarToMin(value), viewingDistanceMm); // LogMAR to MAR, then MAR to mm
        case 'decimal': return minToMm(decimalToMin(value), viewingDistanceMm); // Decimal to MAR, then MAR to mm
        default: throw new Error(`Unsupported input unit: ${unit}`);
    }
}

// This function takes a value in millimeters (mm) and converts it to a target unit
function convertFromMm(mmValue, targetUnit, ppi, viewingDistanceMm) {
    switch (targetUnit) {
        case 'mm': return mmValue;
        case 'cm': return mmToCm(mmValue);
        case 'm': return mmToM(mmValue);
        case 'in': return mmToIn(mmValue);
        case 'ft': return mmToFt(mmValue);
        case 'pt': return mmToPt(mmValue);
        case 'px': return mmToPx(mmValue, ppi);
        case 'pc': return mmToPc(mmValue);
        case 'deg': return mmToDeg(mmValue, viewingDistanceMm);
        case 'min': return mmToMin(mmValue, viewingDistanceMm);
        case 'sec': return mmToSec(mmValue, viewingDistanceMm);
        case 'snellen': return minToSnellen(mmToMin(mmValue, viewingDistanceMm)); // mm to MAR, then MAR to Snellen
        case 'logmar': return minToLogmar(mmToMin(mmValue, viewingDistanceMm)); // mm to MAR, then MAR to LogMAR
        case 'decimal': return minToDecimal(mmToMin(mmValue, viewingDistanceMm)); // mm to MAR, then MAR to Decimal
        default: throw new Error(`Unsupported output unit: ${targetUnit}`);
    }
}


// --- UI Interaction Logic ---

document.addEventListener('DOMContentLoaded', function() {
    const unitCheckboxes = document.querySelectorAll('.unit-checkbox');
    const resultsContainer = document.getElementById('resultsContainer'); // This will now hold inputs and results
    const viewingDistanceInput = document.getElementById('viewingDistanceInput');
    const viewingDistanceUnitSelect = document.getElementById('viewingDistanceUnit');
    const estimateDistanceCheckbox = document.getElementById('estimateDistanceCheckbox');
    const distanceEstimateSelect = document.getElementById('distanceEstimateSelect');
    const ppiInput = document.getElementById('ppiInput');
    const estimatePpiCheckbox = document.getElementById('estimatePpiCheckbox');
    const ppiEstimateSelect = document.getElementById('ppiEstimateSelect');
    const errorTextElement = document.getElementById('errorText');
    const errorArea = document.getElementById('errorArea');

    // --- Unit Checkbox and Input/Result Item Management ---
    unitCheckboxes.forEach(checkbox => {
        // Initial state based on checkbox checked attribute in HTML
        if (checkbox.checked) {
            createOrUpdateResultItem(checkbox.dataset.unit);
        } else {
            removeResultItem(checkbox.dataset.unit);
        }

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                createOrUpdateResultItem(this.dataset.unit);
                // Focus on the newly created input field
                const newInput = document.getElementById(`input-${this.dataset.unit}`);
                if (newInput) {
                    newInput.value = ''; // Clear value when shown
                    newInput.focus();
                }
            } else {
                removeResultItem(this.dataset.unit);
            }
            // Trigger a conversion after showing/hiding to update other fields
            triggerConversionFromAnyInput();
        });
    });

    // --- Real-time Conversion Trigger for settings ---
    viewingDistanceInput.addEventListener('input', () => performConversions(null)); // Pass null as source to trigger from any existing input
    viewingDistanceUnitSelect.addEventListener('change', () => performConversions(null));
    ppiInput.addEventListener('input', () => performConversions(null));
    estimateDistanceCheckbox.addEventListener('change', () => performConversions(null));
    distanceEstimateSelect.addEventListener('change', () => performConversions(null));
    estimatePpiCheckbox.addEventListener('change', () => performConversions(null));
    ppiEstimateSelect.addEventListener('change', () => performConversions(null));


    // --- Estimate Logic ---
    estimateDistanceCheckbox.addEventListener('change', function() {
        if (this.checked) {
            distanceEstimateSelect.classList.remove('hidden');
            viewingDistanceInput.disabled = true; // Disable manual input
            viewingDistanceUnitSelect.disabled = true; // Disable unit select
            distanceEstimateSelect.value = ''; // Clear selection
        } else {
            distanceEstimateSelect.classList.add('hidden');
            viewingDistanceInput.disabled = false; // Enable manual input
            viewingDistanceUnitSelect.disabled = false; // Enable unit select
        }
        performConversions(null); // Recalculate based on new state
    });

    distanceEstimateSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        let distanceMm = 0;
        switch (selectedValue) {
            case 'smartphone': distanceMm = 300; break;
            case 'book': distanceMm = 400; break;
            case 'laptop': distanceMm = 600; break;
            case 'laptop': distanceMm = 600; break;
            case 'computer': distanceMm = 700; break;
            case 'TV': distanceMm = 2500; break;
            case 'car': distanceMm = 711; break; //28 in
            case 'medication': distanceMm = 200; break;
            case 'near': distanceMm = 400; break;
            case 'intermediate': distanceMm = 200; break;
            case 'distant': distanceMm = 5000; break; 
            default: distanceMm = 400; // Default if nothing selected
        }
        viewingDistanceInput.value = distanceMm;
        viewingDistanceUnitSelect.value = 'mm'; // Standardize to mm for estimates
        performConversions(null);
    });

    estimatePpiCheckbox.addEventListener('change', function() {
        if (this.checked) {
            ppiEstimateSelect.classList.remove('hidden');
            ppiInput.disabled = true; // Disable manual input
            ppiEstimateSelect.value = ''; // Clear selection
        } else {
            ppiEstimateSelect.classList.add('hidden');
            ppiInput.disabled = false; // Enable manual input
        }
        performConversions(null); // Recalculate based on new state
    });

    ppiEstimateSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        let ppiValue = 0;
        switch (selectedValue) {
            case 'logical': ppiValue = 96; break;
            case 'smartphone': ppiValue = 450; break;
            case 'tablet': ppiValue = 250; break;
            case 'laptop': ppiValue = 200; break;
            case 'monitor': ppiValue = 150; break;
            case 'watch': ppiValue = 350; break;
            case 'TV': ppiValue = 80; break;
            case 'e-reader': ppiValue = 200; break;
            case 'car': ppiValue = 200; break;
            default: ppiValue = 96; // Default
        }
        ppiInput.value = ppiValue;
        performConversions(null);
    });

    // --- Results Display Management ---
    function createOrUpdateResultItem(unit) {
        let resultItem = document.getElementById(`result-${unit}`);
        if (!resultItem) {
            resultItem = document.createElement('div');
            resultItem.id = `result-${unit}`;
            resultItem.classList.add('result-item-with-input'); // New class for combined item
            resultItem.innerHTML = `
                <label for="input-${unit}" class="unit-label">${getUnitLabel(unit)}:</label>
                <input type="${unit === 'snellen' ? 'text' : 'number'}" class="unit-input" id="input-${unit}" data-unit="${unit}" placeholder="Enter value">
            `;
            resultsContainer.appendChild(resultItem);

            // Attach event listener to the newly created input
            const newInput = document.getElementById(`input-${unit}`);
            newInput.addEventListener('input', function() {
                performConversions(this); // Pass the specific input that triggered the event
            });
        }
    }

    function removeResultItem(unit) {
        const resultItem = document.getElementById(`result-${unit}`);
        if (resultItem) {
            resultItem.remove();
        }
    }

    function getUnitLabel(unit) {
        const labels = {
            'mm': 'Millimeters (mm)', 'cm': 'Centimeters (cm)', 'm': 'Meters (m)',
            'in': 'Inches (in)', 'ft': 'Feet (ft)', 'pt': 'PostScript Points (pt)',
            'px': 'Pixels (px)', 'pc': 'Picas (pc)', 'deg': 'Degrees (deg)',
            'min': 'Minutes (min)', 'sec': 'Seconds (sec)', 'snellen': 'Snellen (20/X)',
            'logmar': 'LogMAR', 'decimal': 'Decimal Acuity'
        };
        return labels[unit] || unit;
    }

    // --- Core Conversion Execution ---
    function performConversions(sourceInput) { // Now accepts sourceInput as an argument
        errorTextElement.textContent = ''; // Clear previous errors
        errorArea.style.display = 'none'; // Hide error area

        const currentUnitInputs = document.querySelectorAll('.result-item-with-input .unit-input'); // Get inputs from results area

        let sourceValue = null;
        let sourceUnit = null;

        if (sourceInput && sourceInput.value !== '' && !isNaN(parseFloat(sourceInput.value))) {
            // If a specific sourceInput is provided and has a valid value
            if (sourceInput.dataset.unit === 'snellen') {
                const snellenParts = sourceInput.value.split('/').map(s => parseFloat(s.trim()));
                if (snellenParts.length === 2 && snellenParts[0] === 20 && !isNaN(snellenParts[1]) && snellenParts[1] > 0) {
                    sourceValue = snellenParts[1];
                    sourceUnit = sourceInput.dataset.unit;
                } else if (!sourceInput.value.includes('/') && !isNaN(parseFloat(sourceInput.value))) {
                    sourceValue = parseFloat(sourceInput.value);
                    sourceUnit = sourceInput.dataset.unit;
                } else {
                    errorTextElement.textContent = "Invalid Snellen format. Use '20/X' or just 'X'.";
                    errorArea.style.display = 'block';
                    return;
                }
            } else {
                sourceValue = parseFloat(sourceInput.value);
                sourceUnit = sourceInput.dataset.unit;
            }
        } else {
            // If no specific sourceInput is provided (e.g., from settings change)
            // or the provided sourceInput is empty/invalid, find the first valid input
            for (const input of currentUnitInputs) {
                if (input.value !== '' && !isNaN(parseFloat(input.value))) {
                    if (input.dataset.unit === 'snellen') {
                        const snellenParts = input.value.split('/').map(s => parseFloat(s.trim()));
                        if (snellenParts.length === 2 && snellenParts[0] === 20 && !isNaN(snellenParts[1]) && snellenParts[1] > 0) {
                            sourceValue = snellenParts[1];
                            sourceUnit = input.dataset.unit;
                            sourceInput = input; // Set sourceInput for clearing logic
                            break;
                        } else if (!input.value.includes('/') && !isNaN(parseFloat(input.value))) {
                            sourceValue = parseFloat(input.value);
                            sourceUnit = input.dataset.unit;
                            sourceInput = input; // Set sourceInput for clearing logic
                            break;
                        }
                    } else {
                        sourceValue = parseFloat(input.value);
                        sourceUnit = input.dataset.unit;
                        sourceInput = input; // Set sourceInput for clearing logic
                        break;
                    }
                }
            }
        }


        if (sourceValue === null || isNaN(sourceValue)) {
            // No valid numeric input found, clear all other fields
            currentUnitInputs.forEach(input => {
                input.value = ''; // Clear all inputs if no source is found
            });
            return;
        }

        const currentPpi = parseFloat(ppiInput.value);
        let currentViewingDistanceMm = parseFloat(viewingDistanceInput.value);
        const selectedViewingDistanceUnit = viewingDistanceUnitSelect.value;

        // Convert viewing distance to mm based on its selected unit
        switch (selectedViewingDistanceUnit) {
            case 'cm': currentViewingDistanceMm = cmToMm(currentViewingDistanceMm); break;
            case 'in': currentViewingDistanceMm = inToMm(currentViewingDistanceMm); break;
            case 'ft': currentViewingDistanceMm = ftToMm(currentViewingDistanceMm); break;
            case 'm': currentViewingDistanceMm = mToMm(currentViewingDistanceMm); break;
        }

        try {
            const valueInMm = convertToMm(sourceValue, sourceUnit, currentPpi, currentViewingDistanceMm);

            currentUnitInputs.forEach(targetInput => {
                // Only update if it's not the source input that the user is currently typing into
                if (targetInput !== sourceInput) {
                    const targetUnit = targetInput.dataset.unit;
                    let convertedResult;

                    if (targetUnit === 'snellen') {
                        const minutes = mmToMin(valueInMm, currentViewingDistanceMm);
                        convertedResult = minToSnellen(minutes);
                        if (convertedResult > 0 && isFinite(convertedResult)) {
                             targetInput.value = `20/${convertedResult.toFixed(0)}`;
                        } else {
                             targetInput.value = '';
                        }
                    } else {
                        convertedResult = convertFromMm(valueInMm, targetUnit, currentPpi, currentViewingDistanceMm);
                        if (isFinite(convertedResult)) {
                            targetInput.value = convertedResult.toFixed(4);
                        } else {
                            targetInput.value = '';
                        }
                    }
                }
            });

        } catch (error) {
            errorTextElement.textContent = `Conversion Error: ${error.message}`;
            errorArea.style.display = 'block';
            // Clear all other fields on error if the source input is the only one with a value
            currentUnitInputs.forEach(input => {
                if (input !== sourceInput) {
                    input.value = '';
                }
            });
        }
    }

    // Function to trigger conversion from any input, useful after checkbox changes
    function triggerConversionFromAnyInput() {
        const currentUnitInputs = document.querySelectorAll('.result-item-with-input .unit-input');
        // Find the first visible input with a value and use it as the source
        for (const input of currentUnitInputs) {
            if (input.value !== '' && !isNaN(parseFloat(input.value))) {
                performConversions(input); // Pass this input as the source
                return;
            }
        }
        // If no input has a value, clear all visible inputs
        currentUnitInputs.forEach(input => {
            input.value = '';
        });
    }

    // Initial setup on page load
    triggerConversionFromAnyInput();
});
