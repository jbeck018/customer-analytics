package queries

import (
	"math"
)

var (
	e10 = math.Sqrt(50)
	e5  = math.Sqrt(10)
	e2  = math.Sqrt(2)
)

func calculateE(stepError float64) float64 {
	if stepError >= e10 {
		return 10
	} else if stepError >= e5 {
		return 5
	} else if stepError >= e2 {
		return 2
	}
	return 1
}

func tickIncrement(start, stop, count float64) float64 {
	step := (stop - start) / math.Max(0, count)
	power := math.Floor(math.Log(step) / math.Log(10))
	stepError := step / math.Pow(10, power)

	e := calculateE(stepError)
	if power >= 0 {
		return e * math.Pow(10, power)
	}

	return -math.Pow(10, -power) / e
}

// Returns a new interval with nicer looking bounds covering the given interval and the step relative to the number of ticks (`count` parameter).
// The new bounds are guaranteed to align with the human-friendly gap between ticks.
// The gap is a rounded value that is a power of 10 multiplied by 1, 2 or 5.
// This approach is inspired by d3.js, see d3.nice() function.
func NiceAndStep(start, stop, count float64) (float64, float64, float64) {
	var prestep float64
	iterations := 0
	for {
		iterations++
		step := tickIncrement(start, stop, count)
		if step == prestep || step == 0 || math.IsInf(step, 0) || math.IsNaN(step) || iterations > 10 {
			if prestep < 0.0 {
				prestep = 1 / -prestep
			}
			return start, stop, prestep
		} else if step > 0 {
			start = math.Floor(start/step) * step
			stop = math.Ceil(stop/step) * step
		} else if step < 0 {
			start = math.Ceil(start*step) / step
			stop = math.Floor(stop*step) / step
		}
		prestep = step
	}
}
