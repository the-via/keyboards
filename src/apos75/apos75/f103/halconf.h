/* Copyright 2021 QMK
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#pragma once

#include_next <halconf.h>

#undef HAL_USE_ADC
# define HAL_USE_ADC TRUE

//#undef HAL_USE_PWM
//# define HAL_USE_PWM TRUE

#undef HAL_USE_UART
# define HAL_USE_UART   TRUE

#undef HAL_USE_PAL
# define HAL_USE_PAL  TRUE
//#undef  UART_USE_MUTUAL_EXCLUSION
//# define UART_USE_MUTUAL_EXCLUSION FALSE

//#undef  SERIAL_BUFFERS_SIZE
//# define SERIAL_BUFFERS_SIZE     128

//#undef  UART_USE_WAIT
//# define UART_USE_WAIT TRUE

 //#define HAL_USE_I2C TRUE

//#undef CORTEX_ENABLE_WFI_IDLE
//# define CORTEX_ENABLE_WFI_IDLE


