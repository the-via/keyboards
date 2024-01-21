/* Copyright 2021 JasonRen(biu)
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

//#include "config_common.h"

#ifdef RGB_MATRIX_ENABLE
    #ifndef VIA_QMK_RGBLIGHT_ENABLE
        #define VIA_QMK_RGBLIGHT_ENABLE
    #endif
#endif

#define nrf_BLUETOOTH_ENABLE //BLUETOOTH_ENABLE
// enable the nkro when using the VIA.
#define FORCE_NKRO
#define STM32_LSECLK 32768
// fix VIA RGB_light
//#define VIA_HAS_BROKEN_KEYCODES

/* Set 0 if debouncing isn't needed */
#define DEBOUNCE 5

#define TAP_CODE_DELAY 15

#define HOLD_ON_OTHER_KEY_PRESS
#define TAP_HOLD_CAPS_DELAY 150

#define RGB_SW_PIN A15    //rgb switch
// for ble
#define DISABLE_MAGIC_BOOTLOADER
#define DISABLE_EEPROM_CLEAR

#define RGB_DI_PIN C15

#define SLEEPMODE_ENABLE
#define RGBLIGHT_SLEEP
#define APOS75_DISABLE_UNDERGLOW     //no use buttom rgb

#if defined(RGB_MATRIX_ENABLE)
    #ifndef APOS75_DISABLE_UNDERGLOW
        #define DRIVER_LED_TOTAL 102
    #else
        #define DRIVER_LED_TOTAL 82
        #define APOS75_DISABLED_LED_TOTAL 20
    #endif
    #define RGB_MATRIX_LED_COUNT DRIVER_LED_TOTAL
    #define RGB_DISABLE_WHEN_USB_SUSPENDED     // turn off effects when suspended
    #define RGB_MATRIX_MAXIMUM_BRIGHTNESS 160  // limits maximum brightness of LEDs to x out of 255. If not defined maximum brightness is set to 255
    #define RGB_MATRIX_DEFAULT_HUE 0
    #define RGB_MATRIX_DEFAULT_SAT 50
    #define RGB_MATRIX_STARTUP_VAL 50
    #define RGB_MATRIX_DEFAULT_VAL 50
    #define RGB_MATRIX_FRAMEBUFFER_EFFECTS
    #define RGB_MATRIX_LED_PROCESS_LIMIT (RGB_MATRIX_LED_COUNT + 4) / 5 // limits the number of LEDs to process in an animation per task run (increases keyboard responsiveness)
    #define RGB_MATRIX_LED_FLUSH_LIMIT 16      // limits in milliseconds how frequently an animation will update the LEDs. 16 (16ms) is equivalent to limiting to 60fps (increases keyboard responsiveness)
    #define RGB_MATRIX_KEYPRESSES
    /* RGB Matrix effect */
    #define ENABLE_RGB_MATRIX_ALPHAS_MODS
    #define ENABLE_RGB_MATRIX_GRADIENT_UP_DOWN
    #define ENABLE_RGB_MATRIX_GRADIENT_LEFT_RIGHT
    #define ENABLE_RGB_MATRIX_BREATHING
    #define ENABLE_RGB_MATRIX_BAND_SAT
    #define ENABLE_RGB_MATRIX_BAND_VAL
    #define ENABLE_RGB_MATRIX_BAND_PINWHEEL_SAT
    #define ENABLE_RGB_MATRIX_BAND_PINWHEEL_VAL
    #define ENABLE_RGB_MATRIX_BAND_SPIRAL_SAT
    #define ENABLE_RGB_MATRIX_BAND_SPIRAL_VAL
    #define ENABLE_RGB_MATRIX_CYCLE_ALL
    #define ENABLE_RGB_MATRIX_CYCLE_LEFT_RIGHT
    #define ENABLE_RGB_MATRIX_CYCLE_UP_DOWN
    #define ENABLE_RGB_MATRIX_RAINBOW_MOVING_CHEVRON
    #define ENABLE_RGB_MATRIX_CYCLE_OUT_IN
    #define ENABLE_RGB_MATRIX_CYCLE_OUT_IN_DUAL
    #define ENABLE_RGB_MATRIX_CYCLE_PINWHEEL
    #define ENABLE_RGB_MATRIX_CYCLE_SPIRAL
    #define ENABLE_RGB_MATRIX_DUAL_BEACON
    #define ENABLE_RGB_MATRIX_RAINBOW_BEACON
    #define ENABLE_RGB_MATRIX_RAINBOW_PINWHEELS
    #define ENABLE_RGB_MATRIX_RAINDROPS
    #define ENABLE_RGB_MATRIX_JELLYBEAN_RAINDROPS
    #define ENABLE_RGB_MATRIX_HUE_BREATHING
    #define ENABLE_RGB_MATRIX_HUE_PENDULUM
    #define ENABLE_RGB_MATRIX_HUE_WAVE
    #define ENABLE_RGB_MATRIX_PIXEL_RAIN

    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE_SIMPLE
    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE
    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE_WIDE
    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE_MULTIWIDE
    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE_CROSS
    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE_MULTICROSS
    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE_NEXUS
    #define ENABLE_RGB_MATRIX_SOLID_REACTIVE_MULTINEXUS
    #define ENABLE_RGB_MATRIX_SPLASH
    #define ENABLE_RGB_MATRIX_MULTISPLASH
    #define ENABLE_RGB_MATRIX_SOLID_SPLASH
    #define ENABLE_RGB_MATRIX_SOLID_MULTISPLASH
#endif  // RGB_MATRIX_ENABLE

#if(RGBLIGHT_ENABLE)
#ifdef RGB_DI_PIN
    #define RGBLED_NUM 102       //101
    #define RGBLIGHT_HUE_STEP 8
    #define RGBLIGHT_SAT_STEP 8
    #define RGBLIGHT_VAL_STEP 8
    #define RGBLIGHT_DEFAULT_VAL 40
    #define RGBLIGHT_LIMIT_VAL 120
 #endif
#endif



