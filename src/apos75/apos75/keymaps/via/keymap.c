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
 * along with this program.  If not, see <http: //www.gnu.org/licenses/>.
 */
#include QMK_KEYBOARD_H
#include "config.h"
#include "version.h"
#include "apos75.h"

//#include "os_detection.h"

#define LAYER_0 81
#define LAYER_1 80
#define LAYER_2 79
#define LAYER_3 78

bool lay_IS_LAYER0_ON;
bool lay_IS_LAYER1_ON;
bool lay_IS_LAYER2_ON;
bool lay_IS_LAYER3_ON;

//uint8_u lay_set_my;

#ifdef RGB_MATRIX_ENABLE
typedef union {
    uint32_t raw;
    struct {
        bool rgb_disable_perkey:1;
        #ifndef APOS75_DISABLE_UNDERGLOW
        bool rgb_disable_underglow:1;
        #endif
    };
} user_config_t;

user_config_t user_config;
#endif
enum macos_consumer_usages {
    _AC_SHOW_ALL_WINDOWS = 0x29F,  // mapped to KC_MCON
    _AC_SHOW_ALL_APPS    = 0x2A0   // mapped to KC_LPAD
};


enum {
    KC_MCTL = USER00,  // macOS Open Mission Control
    KC_LPAD,           // macOS Open Launchpad
    RGB_TPK,           // Toggle Per-Key
    #ifndef APOS75_DISABLE_UNDERGLOW
    RGB_TUG,           // Toggle Underglow
    #endif
    KB_VRSN = USER09   // debug, type version
};

//static uint8_t my_lay_set;
#ifdef APOS75_DISABLE_UNDERGLOW
    #define RGB_TUG _______
#endif


/* Special Keys */
#define SK_LT1C LT(1, KC_CAPS)  // Layer Tap 1, i.e., Tap = Caps Lock, Hold = Layer 1
#define SK_LT2M LT(2, KC_MENU)  // Layer Tap 2, i.e., Tap = Menu, Hold = Layer 2

//#define GUSP(kc) (QK_LGUI | (kc))  //

#ifdef APOS75_DISABLE_UNDERGLOW
    #define RGB_TUG _______
#endif


/* Special Keys */
#define SK_LT1C LT(1, KC_CAPS)  // Layer Tap 1, i.e., Tap = Caps Lock, Hold = Layer 1
#define SK_LT2M LT(2, KC_MENU)  // Layer Tap 2, i.e., Tap = Menu, Hold = Layer 2


#define APOS75_CAPS_LOCK_KEY_INDEX 37  // position of Caps Lock key

#define APOS75_CAPS_LOCK_MAX_BRIGHTNESS 60
#ifdef RGB_MATRIX_MAXIMUM_BRIGHTNESS
    #undef APOS75_CAPS_LOCK_MAX_BRIGHTNESS
    #define APOS75_CAPS_LOCK_MAX_BRIGHTNESS RGB_MATRIX_MAXIMUM_BRIGHTNESS
#endif

#define APOS75_CAPS_LOCK_VAL_STEP 8
#ifdef RGB_MATRIX_VAL_STEP
    #undef APOS75_CAPS_LOCK_VAL_STEP
    #define APOS75_CAPS_LOCK_VAL_STEP RGB_MATRIX_VAL_STEP
#endif
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
   LAYOUT(
        KC_ESC,  KC_F1,   KC_F2,   KC_F3,   KC_F4,    KC_F5,   KC_F6,   KC_F7,   KC_F8,   KC_F9,
		KC_F10,  KC_F11,  KC_F12,  KC_DEL, KC_VOLD,  KC_MUTE, KC_VOLU, KC_GRV,  KC_1,    KC_2,
		KC_3,    KC_4,    KC_5,    KC_6,    KC_7,     KC_8,    KC_9,    KC_0,    KC_MINS, KC_EQL,
		KC_BSPC, KC_PGUP, KC_TAB,  KC_Q,    KC_W,     KC_E,    KC_R,    KC_T,    KC_Y,    KC_U,
		KC_I,    KC_O,    KC_P,    KC_LBRC, KC_RBRC,  KC_BSLS, KC_PGDN, KC_CAPS, KC_A,    KC_S,
		KC_D,    KC_F,    KC_G,    KC_H,    KC_J,     KC_K,    KC_L,    KC_SCLN, KC_QUOT,
		KC_ENT,  KC_HOME, KC_LSFT, KC_Z,    KC_X,     KC_C,    KC_V,    KC_B,    KC_N,    KC_M,
		KC_COMM, KC_DOT,  KC_SLSH, KC_RSFT, KC_END,  KC_UP,   KC_LCTL, KC_LGUI,  KC_LALT,
		KC_SPC,  KC_RALT, MO(1), KC_RCTL, KC_LEFT,    KC_DOWN, KC_RGHT),

	LAYOUT(
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_MPRV, KC_MPLY, KC_MNXT, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, DF(2),   KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, RGB_TOG, RGB_VAD, RGB_VAI, RGB_RMOD,RGB_MOD, RGB_SPD, RGB_SPI,
		RGB_HUI, RGB_HUD, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS),

	LAYOUT(
		KC_ESC, KC_F1,   KC_F2,   KC_F3,     KC_F4,    KC_F5,   KC_F6,   KC_F7,   KC_F8,   KC_F9,
		KC_F10,  KC_F11,  KC_F12,  KC_DEL,    KC_VOLD,  KC_MUTE, KC_VOLU, KC_GRV,  KC_1,    KC_2,
		KC_3,    KC_4,    KC_5,    KC_6,      KC_7,     KC_8,    KC_9,    KC_0,    KC_MINS, KC_EQL,
		KC_BSPC, KC_PGUP, KC_TAB,  KC_Q,      KC_W,     KC_E,    KC_R,    KC_T,    KC_Y,    KC_U,
		KC_I,    KC_O,    KC_P,    KC_LBRC,   KC_RBRC,  KC_BSLS, KC_PGDN, KC_CAPS, KC_A,    KC_S,
		KC_D,    KC_F,    KC_G,    KC_H,      KC_J,     KC_K,    KC_L,    KC_SCLN, KC_QUOT,
		KC_ENT,  KC_HOME, KC_LSFT, KC_Z,      KC_X,     KC_C,    KC_V,    KC_B,    KC_N,    KC_M,
		KC_COMM, KC_DOT,  KC_SLSH, KC_RSFT,   KC_END,   KC_UP,   KC_LCTL, KC_LALT, KC_LGUI,
		KC_SPC,  KC_RGUI, MO(3),   KC_RALT,   KC_LEFT,  KC_DOWN, KC_RGHT),

	LAYOUT(
		KC_TRNS, KC_BRID, KC_BRIU, KC_MCTL,  KC_LPAD,   KC_WSCH, LGUI(KC_SPC),KC_MPRV, KC_MPLY, KC_MNXT,
		KC_MUTE, KC_VOLD, KC_VOLU, KC_TRNS,  KC_MPRV,   KC_MPLY, KC_MNXT, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,  KC_TRNS,   KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, DF(0),   KC_TRNS,  KC_TRNS ,  KC_TRNS ,KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,  KC_TRNS,   KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,  KC_TRNS,   KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, RGB_TOG,  RGB_VAD,   RGB_VAI, RGB_RMOD,RGB_MOD, RGB_SPD, RGB_SPI,
		RGB_HUI, RGB_HUD, KC_TRNS, KC_TRNS,  KC_TRNS,   KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
		KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,  KC_TRNS,   KC_TRNS, KC_TRNS)

};

#ifdef RGB_MATRIX_ENABLE

user_config_t user_config;

void APOS75_update_rgb_mode(void) {
    uint8_t flags = LED_FLAG_ALL;

    if (user_config.rgb_disable_perkey
    #ifndef APOS75_DISABLE_UNDERGLOW
     && user_config.rgb_disable_underglow
    #endif
     ) {
        flags = 0;  // All OFF Condition
    } else {
        if (user_config.rgb_disable_perkey) {
            #ifndef APOS75_DISABLE_UNDERGLOW
              flags = LED_FLAG_UNDERGLOW | 0xF0;
            #else
              flags = 0xF0;
            #endif
        }
        #ifndef APOS75_DISABLE_UNDERGLOW
        if (user_config.rgb_disable_underglow) {
            flags = LED_FLAG_MODIFIER | LED_FLAG_KEYLIGHT | LED_FLAG_INDICATOR | 0xF0;
        }
        #endif
    }

    if (flags == 0) {
        rgb_matrix_set_flags(0);
        rgb_matrix_set_color_all(HSV_OFF);
    } else {
        rgb_matrix_set_flags(flags);
        rgb_matrix_enable_noeeprom();
    }

    eeconfig_update_kb(user_config.raw);  // write back to EEPROM
}

void APOS75_get_rgb_mode(void) {
    user_config.raw = eeconfig_read_kb();  // read config from EEPROM
    APOS75_update_rgb_mode();
}

// void keyboard_post_init_user(void) {
//     APOS75_get_rgb_mode();
// }

void eeconfig_init_user(void) {
    // EEPROM is getting reset!
    user_config.raw = 0;
    APOS75_update_rgb_mode();
}

void rgb_matrix_indicators_advanced_user(uint8_t led_min, uint8_t led_max) {
    // Caps Lock key stuff
    if (host_keyboard_led_state().caps_lock) {
        uint8_t v = rgb_matrix_get_val();
        if (v < APOS75_CAPS_LOCK_VAL_STEP) {
            v = APOS75_CAPS_LOCK_VAL_STEP;
        } else if (v < (APOS75_CAPS_LOCK_MAX_BRIGHTNESS - APOS75_CAPS_LOCK_VAL_STEP)) {
            if (!user_config.rgb_disable_perkey) {
                v += APOS75_CAPS_LOCK_VAL_STEP;  // inc. by one more step than current brightness
            }  // else leave as current brightness
        } else {
            v = APOS75_CAPS_LOCK_MAX_BRIGHTNESS;
        }
        rgb_matrix_set_color(APOS75_CAPS_LOCK_KEY_INDEX, v, v, v);  // white, brightness adjusted
    } else if (user_config.rgb_disable_perkey) {
        rgb_matrix_set_color(APOS75_CAPS_LOCK_KEY_INDEX, HSV_OFF);  // off
    }
    switch(get_highest_layer(layer_state|default_layer_state)) {
        case 0:
            rgb_matrix_set_color(80, RGB_BLUE);
            break;
        case 1:
            rgb_matrix_set_color(79, RGB_YELLOW);
            break;
        case 2:
            rgb_matrix_set_color(78, RGB_BLUE);
            break;
        case 3:
            rgb_matrix_set_color(77, RGB_YELLOW);
            break;
        default:
            break;
    }

#endif  // RGB_MATRIX_ENABLE
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
#ifdef RGB_MATRIX_ENABLE
    switch(keycode) {
        case TG(2):
           if (record->event.pressed) {
             set_single_persistent_default_layer(2);
             layer_state_set(2);
           }
           return false;
        case TO(0):
           if (record->event.pressed) {
             set_single_persistent_default_layer(0);
             layer_state_set(0);
           }
           return false;
        case QK_BOOT:
            if (record->event.pressed) {
                rgb_matrix_set_color_all(RGB_MATRIX_MAXIMUM_BRIGHTNESS, 0, 0);  // All red
                rgb_matrix_driver.flush();
            }
            return true;
        case RGB_TOG:
            /* roll through the LED modes
             * |    Level    | Per-key | Underglow |
             * |-------------|---------|-----------|
             * | 0 (default) |   on    |    on     |
             * |     1       |   OFF   |    on     |
             * |     2       |   on    |    OFF    |
             * |     3       |   OFF   |    OFF    |
             */
            if (record->event.pressed) {
                if ((!user_config.rgb_disable_perkey)
                #ifndef APOS75_DISABLE_UNDERGLOW
                   && (!user_config.rgb_disable_underglow)
                #endif
                   ) {
                    user_config.rgb_disable_perkey = 1;

                #ifndef APOS75_DISABLE_UNDERGLOW
                } else if ((user_config.rgb_disable_perkey) && (!user_config.rgb_disable_underglow)) {
                    user_config.rgb_disable_perkey = 0;
                    user_config.rgb_disable_underglow = 1;

                } else if ((!user_config.rgb_disable_perkey) && user_config.rgb_disable_underglow) {
                    user_config.rgb_disable_perkey = 1;
                #endif

                } else {
                    user_config.rgb_disable_perkey = 0;
                    #ifndef APOS75_DISABLE_UNDERGLOW
                    user_config.rgb_disable_underglow = 0;
                    #endif

                }
                APOS75_update_rgb_mode();
            }
            return false;

        case RGB_TPK:
            if (record->event.pressed) {
                user_config.rgb_disable_perkey ^= 1;
                APOS75_update_rgb_mode();
            }
            return false;
        #ifndef APOS75_DISABLE_UNDERGLOW
        case RGB_TUG:
            if (record->event.pressed) {
                user_config.rgb_disable_underglow ^= 1;
                APOS75_update_rgb_mode();
            }
            return false;
        #endif
        case EE_CLR:
            if (!record->event.pressed) {  // on release
                APOS75_get_rgb_mode();
            }
            return true;  // let this one pass on
        case KB_VRSN:
            if (!get_mods()) {
                if (!record->event.pressed) {
                    SEND_STRING(QMK_KEYBOARD ":" QMK_KEYMAP " (v" QMK_VERSION ")");
                }
            }
            return false;

        case KC_MCLT:
            if (record->event.pressed) {
                host_consumer_send(_AC_SHOW_ALL_WINDOWS);
                //send_consumer(_AC_SHOW_ALL_WINDOWS);
            } else {
                host_consumer_send(0);
                //send_consumer(0);
            }
            return false;

        case KC_LPAD:
            if (record->event.pressed) {
                host_consumer_send(_AC_SHOW_ALL_APPS);
                //send_consumer(_AC_SHOW_ALL_APPS);
            } else {
                host_consumer_send(0);
                //send_consumer(0);
            }
            return false;
        default:
             return true;
     }
 #endif //RGB_MATRIX_ENABLE
 return true;
}

#ifdef ENCODER_ENABLE
bool encoder_update_user(uint8_t index, bool clockwise) {
    if (index == 0) {
       if (IS_LAYER_ON(0)){
        if (clockwise) {
            tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 5));//tap_code(KC_VOLU);
        } else {
            tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 6));//tap_code(KC_VOLD);
        }
       }
       else if(IS_LAYER_ON(1)){
        if (clockwise) {
            tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 5));//tap_code(KC_VOLD);
        } else {
            tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 6));//tap_code(KC_VOLD);
        }
       }
       else if(IS_LAYER_ON(2)){
        if (clockwise) {
                tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 5));//tap_code(KC_VOLD);
        } else {
                tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 6));//tap_code(KC_VOLD);
        }
       }
       else if(IS_LAYER_ON(3)){
        if (clockwise) {

                tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 5));//tap_code(KC_VOLD);
        } else {
                tap_code(dynamic_keymap_get_keycode(biton32(layer_state), 8, 6));//tap_code(KC_VOLD);
        }
       }
    }
    return true;
}
#endif
#ifdef RGB_MATRIX_ENABLE
#if defined(APOS75_DISABLE_UNDERGLOW) && defined(APOS75_DISABLED_LED_TOTAL)
void keyboard_post_mykey(void) {
    uint8_t i;
    for ( i = DRIVER_LED_TOTAL; i < DRIVER_LED_TOTAL + APOS75_DISABLED_LED_TOTAL; ++i) {
        rgb_matrix_set_color(i, HSV_OFF);
    }
}
 #endif
#endif  // RGB_MATRIX_ENABLE
void keyboard_post_init_user(void)
{
#ifdef RGB_MATRIX_ENABLE
 #if defined(APOS75_DISABLE_UNDERGLOW) && defined(APOS75_DISABLED_LED_TOTAL)
 keyboard_post_mykey();
 #endif
 APOS75_get_rgb_mode();
 #endif  // RGB_MATRIX_ENABLE
writePinHigh(RGB_SW_PIN);            //open RGB
}

