#ENCODER_ENABLE = yes
#ENCODER_MAP_ENABLE = yes
#RGBLIGHT_ENABLE = yes      # Enable keyboard RGB underglow

# Enter lower-power sleep mode when on the ChibiOS idle thread
OPT_DEFS += -DCORTEX_ENABLE_WFI_IDLE=TRUE

DEFAULT_FOLDER = idobao/apos75/f103

#NO_USB_STARTUP_CHECK = yes
LTO_ENABLE = yes
SLEEP_LED_ENABLE = yes

