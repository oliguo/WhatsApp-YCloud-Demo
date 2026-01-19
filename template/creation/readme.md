# Create Template API Link
    https://docs.ycloud.com/reference/whatsapp_template-create
    
# Create a template

Creates a WhatsApp template.

# OpenAPI definition

```json
{
  "openapi": "3.0.0",
  "info": {
    "description": "The [YCloud](https://ycloud.com) API is organized around [REST](https://en.wikipedia.org/wiki/Representational_state_transfer). Our API is designed to have predictable, resource-oriented URLs, return [JSON](https://www.json.org) responses, and use standard HTTP response codes and verbs.",
    "version": "v2",
    "title": "YCloud API",
    "termsOfService": "https://ycloud.com/terms-service",
    "contact": {
      "email": "service@ycloud.com"
    }
  },
  "externalDocs": {
    "description": "Homepage",
    "url": "https://ycloud.com"
  },
  "servers": [
    {
      "url": "https://api.ycloud.com/v2",
      "description": "Base URL"
    }
  ],
  "security": [
    {
      "api_key": []
    }
  ],
  "tags": [
    {
      "name": "WhatsApp Templates"
    }
  ],
  "paths": {
    "/whatsapp/templates": {
      "post": {
        "summary": "Create a template",
        "operationId": "whatsapp_template-create",
        "tags": [
          "WhatsApp Templates"
        ],
        "description": "Creates a WhatsApp template.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "description": "See [WhatsApp Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates).",
                "required": [
                  "wabaId",
                  "name",
                  "language",
                  "category",
                  "components"
                ],
                "properties": {
                  "wabaId": {
                    "type": "string",
                    "description": "WhatsApp Business Account ID.",
                    "example": "whatsapp-business-account-id"
                  },
                  "name": {
                    "type": "string",
                    "description": "Name of the template.",
                    "maxLength": 512,
                    "pattern": "[a-z0-9]{1,512}",
                    "example": "sample_whatsapp_template"
                  },
                  "language": {
                    "type": "string",
                    "description": "Language code of the template. See [Supported Languages](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates#supported-languages) for all codes.",
                    "example": "en"
                  },
                  "category": {
                    "type": "string",
                    "description": "Category of WhatsApp templates.\n- `AUTHENTICATION`: Enable businesses to authenticate users with one-time passcodes, potentially at multiple steps in the login process (e.g., account verification, account recovery, integrity challenges).\n- `MARKETING`: Include promotions or offers, informational updates, or invitations for customers to respond / take action. Any conversation that does not qualify as utility or authentication is a marketing conversation.\n- `UTILITY`: Facilitate a specific, agreed-upon request or transaction or update to a customer about an ongoing transaction, including post-purchase notifications and recurring billing statements.",
                    "enum": [
                      "AUTHENTICATION",
                      "MARKETING",
                      "UTILITY"
                    ],
                    "x-readme-ref-name": "WhatsappTemplateCategory"
                  },
                  "subCategory": {
                    "type": "string",
                    "description": "Subcategory of WhatsApp templates.\n- ORDER_STATUS: Order status template is categorized as `UTILITY` template and apart from name and language of choice, it has general template components such as `BODY`, `FOOTER` and additionally subcategory as `ORDER_STATUS`.",
                    "enum": [
                      "ORDER_STATUS"
                    ],
                    "x-readme-ref-name": "WhatsappTemplateSubCategory"
                  },
                  "messageSendTtlSeconds": {
                    "type": "integer",
                    "format": "int32",
                    "description": "If we are unable to deliver a message for an amount of time that exceeds its time-to-live, we will stop retrying and drop the message.\nBy default, messages that use an authentication template have a default TTL of **10 minutes**, and messages that use a utility or marketing template have a default TTL of **30 days**.\nSet its value between `30` and `900` seconds (i.e., 30 seconds to 15 minutes) for authentication templates, or `30` and `43200` seconds (i.e., 30 seconds to 12 hours) for utility templates, or `43200` and `2592000` seconds (i.e., 12 hours to 30 days) for marketing templates. Alternatively, you can set this value to `-1`, which will set a custom TTL of 30 days for either type of template.\nWe encourage you to set a time-to-live for all of your authentication templates, preferably equal to or less than your code expiration time, to ensure your customers only get a message when a code is still usable.\nAuthentication templates created before October 23, 2024, have a default TTL of 30 days.",
                    "example": 600
                  },
                  "components": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "type": {
                          "type": "string",
                          "description": "**Required.** Template component type.\n- `BODY`: Body components are text-only components and are required by all templates. Templates are limited to one body component.\n- `HEADER`: Headers are optional components that appear at the top of template messages. Headers support text, media (images, videos, documents). Templates are limited to one header component.\n- `FOOTER`: Footers are optional text-only components that appear immediately after the body component. Templates are limited to one footer component.\n- `BUTTONS`: Buttons are optional interactive components that perform specific actions when tapped.\n- `LIMITED_TIME_OFFER`: Use for limited-time offer templates. The delivered message can display an offer expiration details section with a heading, an optional expiration timer, and the offer code itself.\n- `CAROUSEL`: Carousel templates allow you to send a single text message (1), accompanied by a set of up to 10 carousel cards (2) in a horizontally scrollable view.\n- `CALL_PERMISSION_REQUEST`: Sending a template message allows you to initiate a user conversation with a call permission request.",
                          "enum": [
                            "BODY",
                            "HEADER",
                            "FOOTER",
                            "BUTTONS",
                            "LIMITED_TIME_OFFER",
                            "CAROUSEL",
                            "CALL_PERMISSION_REQUEST"
                          ]
                        },
                        "format": {
                          "type": "string",
                          "description": "**Required for type `HEADER`.**",
                          "enum": [
                            "TEXT",
                            "IMAGE",
                            "VIDEO",
                            "DOCUMENT",
                            "LOCATION"
                          ]
                        },
                        "text": {
                          "type": "string",
                          "description": "For body text (type = `BODY`), maximum 1024 characters.\nFor header text (type = `HEADER`, format = `TEXT`), maximum 60 characters.\nFor footer text (type = `FOOTER`), maximum 60 characters.\nFor card body text (`CAROUSEL` card component type = `BODY`), maximum 160 characters.",
                          "maxLength": 1024
                        },
                        "buttons": {
                          "type": "array",
                          "description": "**Required for type `BUTTONS`.**\nButtons are optional interactive components that perform specific actions when tapped. Templates can have a mixture of up to 10 button components total, although there are limits to individual buttons of the same type as well as combination limits.\nIf a template has more than three buttons, two buttons will appear in the delivered message and the remaining buttons will be replaced with a **See all options** button. Tapping the **See all options** button reveals the remaining buttons.",
                          "maxItems": 10,
                          "items": {
                            "type": "object",
                            "required": [
                              "type"
                            ],
                            "properties": {
                              "type": {
                                "type": "string",
                                "description": "Button type.\n- `PHONE_NUMBER`: Phone number buttons call the specified business phone number when tapped by the app user. Templates are limited to one phone number button.\n- `URL`: URL buttons load the specified URL in the device's default web browser when tapped by the app user. Templates are limited to two URL buttons.\n- `QUICK_REPLY`: Quick reply buttons are custom text-only buttons that immediately message you with the specified text string when tapped by the app user. Templates are limited to 10 quick reply buttons. If using quick reply buttons with other buttons, buttons must be organized into two groups: quick reply buttons and non-quick reply buttons.\n- `COPY_CODE`: Copy code buttons copy a text string (defined when the template is sent in a template message) to the device's clipboard when tapped by the app user. Templates are limited to one copy code button.\n- `OTP`: One-time password (OTP) buttons are a special type of URL button component used with authentication templates.\n- `CATALOG`: When a customer taps the **View catalog** button in a catalog template message, your product catalog appears within WhatsApp.\n- `MPM`: Customers can browse products and sections by tapping the **View items** button in a multi-product template message.\n- `FLOW`: Use this type to specify the [Flow](https://developers.facebook.com/docs/whatsapp/flows) to be sent with the template message.\n- `ORDER_DETAILS`: Provides a order details button with `Review and Pay` text.\n- `VOICE_CALL`: Triggers a WhatsApp call, when clicked by a WhatsApp customer.",
                                "enum": [
                                  "PHONE_NUMBER",
                                  "URL",
                                  "QUICK_REPLY",
                                  "COPY_CODE",
                                  "OTP",
                                  "CATALOG",
                                  "MPM",
                                  "FLOW",
                                  "ORDER_DETAILS",
                                  "VOICE_CALL"
                                ],
                                "x-readme-ref-name": "WhatsappTemplateComponentButtonType"
                              },
                              "text": {
                                "type": "string",
                                "description": "**Required for button type `PHONE_NUMBER` or `URL`.** Button text.\nFor `CODE_CODE` buttons, the text is a pre-set value and cannot be customized.\nFor `OTP` buttons, if omitted, the text will default to a pre-set value localized to the template's language. For example, `Copy Code` for English (US). If your template is using a one-tap autofill button and you supply this value, the authentication template message will display a copy code button with this text if we are unable to validate your [handshake](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/autofill-button-authentication-templates#handshake). Maximum 25 characters.",
                                "maxLength": 25
                              },
                              "url": {
                                "type": "string",
                                "description": "**Required for button type `URL`.** URL of website.\nThere can be at most 1 variable at the end of the URL. Example: `https://www.luckyshrub.com/shop?promo={{1}}`.\n2000 characters maximum.",
                                "maxLength": 2000
                              },
                              "phone_number": {
                                "type": "string",
                                "description": "**Required for button type `PHONE_NUMBER`.**\nAlphanumeric string. Business phone number to be (display phone number) called when the user taps the button.\n20 characters maximum.",
                                "maxLength": 20,
                                "example": 15550051310
                              },
                              "otp_type": {
                                "description": "**Required for button type `OTP`.**\nIndicates button OTP type.\nSet to `COPY_CODE` if you want the template to use a copy code button, `ONE_TAP` to have it use a one-tap autofill button, or `ZERO_TAP` to have no button at all.",
                                "type": "string",
                                "enum": [
                                  "COPY_CODE",
                                  "ONE_TAP",
                                  "ZERO_TAP"
                                ],
                                "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpType"
                              },
                              "autofill_text": {
                                "type": "string",
                                "description": "**One-tap and zero-tap buttons only.**\nOne-tap button text.\nMaximum 25 characters.",
                                "maxLength": 25,
                                "example": "Autofill"
                              },
                              "package_name": {
                                "type": "string",
                                "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour Android app's package name.",
                                "example": "com.example.myapplication",
                                "deprecated": true
                              },
                              "signature_hash": {
                                "type": "string",
                                "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                "example": "K8a%2FAINcGX7",
                                "deprecated": true
                              },
                              "supported_apps": {
                                "type": "array",
                                "description": "**One-tap and zero-tap buttons only.**\nList of supported apps.",
                                "items": {
                                  "description": "The supported_apps array allows you define pairs of app package names and signing key hashes for up to 5 apps. This can be useful if you have different app builds and want each of them to be able to initiate the handshake:",
                                  "type": "object",
                                  "properties": {
                                    "package_name": {
                                      "type": "string",
                                      "description": "Your Android app's package name.",
                                      "example": "com.example.myapplication"
                                    },
                                    "signature_hash": {
                                      "type": "string",
                                      "description": "Your app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                      "example": "K8a%2FAINcGX7"
                                    }
                                  },
                                  "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpSupportedApp"
                                }
                              },
                              "zero_tap_terms_accepted": {
                                "type": "boolean",
                                "description": "**Zero-tap buttons only.**\nSet to `true` to indicate that you understand that your use of zero-tap authentication is subject to the WhatsApp Business Terms of Service, and that it's your responsibility to ensure your customers expect that the code will be automatically filled in on their behalf when they choose to receive the zero-tap code through WhatsApp.\nIf set to `false`, the template will not be created as you need to accept zero-tap terms before creating zero-tap enabled message templates."
                              },
                              "example": {
                                "type": "array",
                                "description": "Sample full URL for a `URL` button with a variable.",
                                "items": {
                                  "type": "string"
                                }
                              },
                              "flow_id": {
                                "type": "string",
                                "description": "**Conditionally required for button type `FLOW`.**\nThe unique ID of the Flow. Cannot be used if `flow_name` or `flow_json` parameters are provided. Only one of these parameters is allowed.",
                                "example": "1"
                              },
                              "flow_name": {
                                "type": "string",
                                "description": "**Conditionally required for button type `FLOW`.**\nThe name of the Flow. Cannot be used if `flow_id` or `flow_json` parameters are provided. Only one of these parameters is allowed. The Flow ID is stored in the message template, not the name, so changing the Flow name will not affect existing message templates."
                              },
                              "flow_json": {
                                "type": "string",
                                "description": "**Conditionally required for button type `FLOW`.**\nThe Flow JSON encoded as string with escaping. The Flow JSON specifies the content of the Flow. Cannot be used if `flow_id` or `flow_name` parameters are provided. Only one of these parameters is allowed."
                              },
                              "flow_action": {
                                "type": "string",
                                "description": "**Use for button type `FLOW`.**\nEither `navigate` or `data_exchange`. Defaults to `navigate`.",
                                "example": "navigate"
                              },
                              "navigate_screen": {
                                "type": "string",
                                "description": "**Required if `flow_action` is `navigate`.**\nThe unique ID of the Screen in the Flow.",
                                "example": "WELCOME_SCREEN"
                              },
                              "app_deep_link": {
                                "type": "object",
                                "properties": {
                                  "meta_app_id": {
                                    "type": "string",
                                    "description": "Required if using a URL button mapped to a deep link. APP ID.",
                                    "example": "2892949377516980"
                                  },
                                  "android_deep_link": {
                                    "type": "string",
                                    "description": "Required if using a URL button component mapped to a deep link.The WhatsApp client will attempt to load this URI if the WhatsApp user taps the button on an Android device.",
                                    "example": "luckyshrub://deals/summer/"
                                  },
                                  "android_fallback_playstore_url": {
                                    "type": "string",
                                    "description": "Optional. URL of a website that the WhatsApp client will attempt to load in the device’s default web browser when the button is tapped but unable to load the Android deep link URI.",
                                    "example": "https://www.luckyshrub.com/deals/summer/"
                                  }
                                },
                                "x-readme-ref-name": "WhatsappTemplateComponentButtonAppDeepLink"
                              }
                            },
                            "x-readme-ref-name": "WhatsappTemplateComponentButton"
                          }
                        },
                        "add_security_recommendation": {
                          "type": "boolean",
                          "description": "**Optional. Only applicable in the `BODY` component of an AUTHENTICATION template.**\nSet to `true` if you want the template to include the string, *For your security, do not share this code.* Set to `false` to exclude the string."
                        },
                        "code_expiration_minutes": {
                          "type": "integer",
                          "format": "int32",
                          "description": "**Optional. Only applicable in the `FOOTER` component of an AUTHENTICATION template.**\nIndicates number of minutes the password or code is valid.\nIf omitted, the code expiration warning will not be displayed in the delivered message.\nMinimum 1, maximum 90.",
                          "maximum": 90,
                          "minimum": 1,
                          "example": 5
                        },
                        "limited_time_offer": {
                          "type": "object",
                          "description": "Use for `LIMITED_TIME_OFFER` components.",
                          "properties": {
                            "text": {
                              "type": "string",
                              "description": "**Required.**\nOffer details text.\nMaximum 16 characters.",
                              "maxLength": 16,
                              "example": "Expiring offer!"
                            },
                            "has_expiration": {
                              "type": "boolean",
                              "description": "**Optional.**\nSet to `true` to have the [offer expiration details](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/limited-time-offer-templates#offer-expiration-details) appear in the delivered message.\nIf set to `true`, the copy code button component must be included in the `buttons` array, and must appear first in the array.\nIf set to `false`, offer expiration details will not appear in the delivered message and the copy code button component is optional. If including the copy code button, it must appear first in the `buttons` array."
                            }
                          },
                          "x-readme-ref-name": "WhatsappTemplateComponentLimitedTimeOffer"
                        },
                        "example": {
                          "type": "object",
                          "description": "**Required** when:\n- `type` is `HEADER`, and `format` is one of `IMAGE`, `VIDEO`, or `DOCUMENT`. Provide a sample media URL in `header_url`.\n- `type` is `HEADER`, `format` is `TEXT`, and a variable is used in `text`. Provide a sample value for that variable in `header_text`. There can be at most 1 variable in `HEADER` text.\n- `type` is `BODY`, and variables are used in `text`. Provide sample values for those variables in `body_text`.",
                          "properties": {
                            "body_text": {
                              "type": "array",
                              "description": "Sample values for variables in `text` of a `BODY` component.",
                              "items": {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                }
                              }
                            },
                            "header_text": {
                              "type": "array",
                              "description": "Sample value for the variable in `text` of a `HEADER` component.",
                              "items": {
                                "type": "string"
                              }
                            },
                            "header_url": {
                              "type": "array",
                              "description": "Sample media URL for a `HEADER` component whose format is one of `IMAGE`, `VIDEO`, or `DOCUMENT`.\nSupported types:\n- For `IMAGE`, the URL must end with one of `.jpg`, `.jpeg`, or `.png`, size limit is 5MB.\n- For `VIDEO`, the URL must end with `.mp4`, size limit is 16MB.\n- For `DOCUMENT`, the URL must end with `.pdf`, size limit is 100MB.",
                              "items": {
                                "type": "string"
                              }
                            }
                          },
                          "x-readme-ref-name": "WhatsappTemplateComponentExample"
                        },
                        "cards": {
                          "type": "array",
                          "description": "**Required for type `CAROUSEL`.**\nCarousel templates support up to 10 carousel cards.",
                          "maxItems": 10,
                          "items": {
                            "type": "object",
                            "description": "Carousel templates support up to 10 carousel cards. Cards must have a media header (image or video) and can optionally include body text and up to 2 quick reply buttons, phone number buttons, or URL buttons (button types can be mixed).",
                            "properties": {
                              "components": {
                                "type": "array",
                                "description": "**Required.**\nCard components.",
                                "items": {
                                  "description": "Cards must have a media header (image or video) and can optionally include body text and up to 2 quick reply buttons, phone number buttons, or URL buttons (button types can be mixed).",
                                  "type": "object",
                                  "properties": {
                                    "type": {
                                      "type": "string",
                                      "description": "**Required.**\nCard component type.\n- `BODY`: Body components are text-only components. Cards must have body text.\n- `HEADER`: Cards must have a media header (image or video).\n- `BUTTONS`: Buttons are interactive components that perform specific actions when tapped. Cards must have at least one button, up to 2 buttons.",
                                      "enum": [
                                        "BODY",
                                        "HEADER",
                                        "BUTTONS"
                                      ]
                                    },
                                    "format": {
                                      "type": "string",
                                      "description": "**Required for type `HEADER`.**\nCards must have a media header (image or video).",
                                      "enum": [
                                        "IMAGE",
                                        "VIDEO"
                                      ]
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "**Required for type `BODY`.**\nCard body text supports variables. Maximum 160 characters.",
                                      "maxLength": 160
                                    },
                                    "buttons": {
                                      "type": "array",
                                      "description": "**Required for type `BUTTONS`.**\nCards must have at least one button. Supports 2 buttons. Buttons can be the same or a mix of quick reply buttons, phone number buttons, or URL buttons.",
                                      "minItems": 1,
                                      "maxItems": 2,
                                      "items": {
                                        "type": "object",
                                        "required": [
                                          "type"
                                        ],
                                        "properties": {
                                          "type": {
                                            "type": "string",
                                            "description": "Button type.\n- `PHONE_NUMBER`: Phone number buttons call the specified business phone number when tapped by the app user. Templates are limited to one phone number button.\n- `URL`: URL buttons load the specified URL in the device's default web browser when tapped by the app user. Templates are limited to two URL buttons.\n- `QUICK_REPLY`: Quick reply buttons are custom text-only buttons that immediately message you with the specified text string when tapped by the app user. Templates are limited to 10 quick reply buttons. If using quick reply buttons with other buttons, buttons must be organized into two groups: quick reply buttons and non-quick reply buttons.\n- `COPY_CODE`: Copy code buttons copy a text string (defined when the template is sent in a template message) to the device's clipboard when tapped by the app user. Templates are limited to one copy code button.\n- `OTP`: One-time password (OTP) buttons are a special type of URL button component used with authentication templates.\n- `CATALOG`: When a customer taps the **View catalog** button in a catalog template message, your product catalog appears within WhatsApp.\n- `MPM`: Customers can browse products and sections by tapping the **View items** button in a multi-product template message.\n- `FLOW`: Use this type to specify the [Flow](https://developers.facebook.com/docs/whatsapp/flows) to be sent with the template message.\n- `ORDER_DETAILS`: Provides a order details button with `Review and Pay` text.\n- `VOICE_CALL`: Triggers a WhatsApp call, when clicked by a WhatsApp customer.",
                                            "enum": [
                                              "PHONE_NUMBER",
                                              "URL",
                                              "QUICK_REPLY",
                                              "COPY_CODE",
                                              "OTP",
                                              "CATALOG",
                                              "MPM",
                                              "FLOW",
                                              "ORDER_DETAILS",
                                              "VOICE_CALL"
                                            ],
                                            "x-readme-ref-name": "WhatsappTemplateComponentButtonType"
                                          },
                                          "text": {
                                            "type": "string",
                                            "description": "**Required for button type `PHONE_NUMBER` or `URL`.** Button text.\nFor `CODE_CODE` buttons, the text is a pre-set value and cannot be customized.\nFor `OTP` buttons, if omitted, the text will default to a pre-set value localized to the template's language. For example, `Copy Code` for English (US). If your template is using a one-tap autofill button and you supply this value, the authentication template message will display a copy code button with this text if we are unable to validate your [handshake](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/autofill-button-authentication-templates#handshake). Maximum 25 characters.",
                                            "maxLength": 25
                                          },
                                          "url": {
                                            "type": "string",
                                            "description": "**Required for button type `URL`.** URL of website.\nThere can be at most 1 variable at the end of the URL. Example: `https://www.luckyshrub.com/shop?promo={{1}}`.\n2000 characters maximum.",
                                            "maxLength": 2000
                                          },
                                          "phone_number": {
                                            "type": "string",
                                            "description": "**Required for button type `PHONE_NUMBER`.**\nAlphanumeric string. Business phone number to be (display phone number) called when the user taps the button.\n20 characters maximum.",
                                            "maxLength": 20,
                                            "example": 15550051310
                                          },
                                          "otp_type": {
                                            "description": "**Required for button type `OTP`.**\nIndicates button OTP type.\nSet to `COPY_CODE` if you want the template to use a copy code button, `ONE_TAP` to have it use a one-tap autofill button, or `ZERO_TAP` to have no button at all.",
                                            "type": "string",
                                            "enum": [
                                              "COPY_CODE",
                                              "ONE_TAP",
                                              "ZERO_TAP"
                                            ],
                                            "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpType"
                                          },
                                          "autofill_text": {
                                            "type": "string",
                                            "description": "**One-tap and zero-tap buttons only.**\nOne-tap button text.\nMaximum 25 characters.",
                                            "maxLength": 25,
                                            "example": "Autofill"
                                          },
                                          "package_name": {
                                            "type": "string",
                                            "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour Android app's package name.",
                                            "example": "com.example.myapplication",
                                            "deprecated": true
                                          },
                                          "signature_hash": {
                                            "type": "string",
                                            "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                            "example": "K8a%2FAINcGX7",
                                            "deprecated": true
                                          },
                                          "supported_apps": {
                                            "type": "array",
                                            "description": "**One-tap and zero-tap buttons only.**\nList of supported apps.",
                                            "items": {
                                              "description": "The supported_apps array allows you define pairs of app package names and signing key hashes for up to 5 apps. This can be useful if you have different app builds and want each of them to be able to initiate the handshake:",
                                              "type": "object",
                                              "properties": {
                                                "package_name": {
                                                  "type": "string",
                                                  "description": "Your Android app's package name.",
                                                  "example": "com.example.myapplication"
                                                },
                                                "signature_hash": {
                                                  "type": "string",
                                                  "description": "Your app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                                  "example": "K8a%2FAINcGX7"
                                                }
                                              },
                                              "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpSupportedApp"
                                            }
                                          },
                                          "zero_tap_terms_accepted": {
                                            "type": "boolean",
                                            "description": "**Zero-tap buttons only.**\nSet to `true` to indicate that you understand that your use of zero-tap authentication is subject to the WhatsApp Business Terms of Service, and that it's your responsibility to ensure your customers expect that the code will be automatically filled in on their behalf when they choose to receive the zero-tap code through WhatsApp.\nIf set to `false`, the template will not be created as you need to accept zero-tap terms before creating zero-tap enabled message templates."
                                          },
                                          "example": {
                                            "type": "array",
                                            "description": "Sample full URL for a `URL` button with a variable.",
                                            "items": {
                                              "type": "string"
                                            }
                                          },
                                          "flow_id": {
                                            "type": "string",
                                            "description": "**Conditionally required for button type `FLOW`.**\nThe unique ID of the Flow. Cannot be used if `flow_name` or `flow_json` parameters are provided. Only one of these parameters is allowed.",
                                            "example": "1"
                                          },
                                          "flow_name": {
                                            "type": "string",
                                            "description": "**Conditionally required for button type `FLOW`.**\nThe name of the Flow. Cannot be used if `flow_id` or `flow_json` parameters are provided. Only one of these parameters is allowed. The Flow ID is stored in the message template, not the name, so changing the Flow name will not affect existing message templates."
                                          },
                                          "flow_json": {
                                            "type": "string",
                                            "description": "**Conditionally required for button type `FLOW`.**\nThe Flow JSON encoded as string with escaping. The Flow JSON specifies the content of the Flow. Cannot be used if `flow_id` or `flow_name` parameters are provided. Only one of these parameters is allowed."
                                          },
                                          "flow_action": {
                                            "type": "string",
                                            "description": "**Use for button type `FLOW`.**\nEither `navigate` or `data_exchange`. Defaults to `navigate`.",
                                            "example": "navigate"
                                          },
                                          "navigate_screen": {
                                            "type": "string",
                                            "description": "**Required if `flow_action` is `navigate`.**\nThe unique ID of the Screen in the Flow.",
                                            "example": "WELCOME_SCREEN"
                                          },
                                          "app_deep_link": {
                                            "type": "object",
                                            "properties": {
                                              "meta_app_id": {
                                                "type": "string",
                                                "description": "Required if using a URL button mapped to a deep link. APP ID.",
                                                "example": "2892949377516980"
                                              },
                                              "android_deep_link": {
                                                "type": "string",
                                                "description": "Required if using a URL button component mapped to a deep link.The WhatsApp client will attempt to load this URI if the WhatsApp user taps the button on an Android device.",
                                                "example": "luckyshrub://deals/summer/"
                                              },
                                              "android_fallback_playstore_url": {
                                                "type": "string",
                                                "description": "Optional. URL of a website that the WhatsApp client will attempt to load in the device’s default web browser when the button is tapped but unable to load the Android deep link URI.",
                                                "example": "https://www.luckyshrub.com/deals/summer/"
                                              }
                                            },
                                            "x-readme-ref-name": "WhatsappTemplateComponentButtonAppDeepLink"
                                          }
                                        },
                                        "x-readme-ref-name": "WhatsappTemplateComponentButton"
                                      }
                                    },
                                    "example": {
                                      "type": "object",
                                      "description": "**Required** when:\n- `type` is `HEADER`, and `format` is one of `IMAGE`, `VIDEO`, or `DOCUMENT`. Provide a sample media URL in `header_url`.\n- `type` is `HEADER`, `format` is `TEXT`, and a variable is used in `text`. Provide a sample value for that variable in `header_text`. There can be at most 1 variable in `HEADER` text.\n- `type` is `BODY`, and variables are used in `text`. Provide sample values for those variables in `body_text`.",
                                      "properties": {
                                        "body_text": {
                                          "type": "array",
                                          "description": "Sample values for variables in `text` of a `BODY` component.",
                                          "items": {
                                            "type": "array",
                                            "items": {
                                              "type": "string"
                                            }
                                          }
                                        },
                                        "header_text": {
                                          "type": "array",
                                          "description": "Sample value for the variable in `text` of a `HEADER` component.",
                                          "items": {
                                            "type": "string"
                                          }
                                        },
                                        "header_url": {
                                          "type": "array",
                                          "description": "Sample media URL for a `HEADER` component whose format is one of `IMAGE`, `VIDEO`, or `DOCUMENT`.\nSupported types:\n- For `IMAGE`, the URL must end with one of `.jpg`, `.jpeg`, or `.png`, size limit is 5MB.\n- For `VIDEO`, the URL must end with `.mp4`, size limit is 16MB.\n- For `DOCUMENT`, the URL must end with `.pdf`, size limit is 100MB.",
                                          "items": {
                                            "type": "string"
                                          }
                                        }
                                      },
                                      "x-readme-ref-name": "WhatsappTemplateComponentExample"
                                    }
                                  },
                                  "x-readme-ref-name": "WhatsappTemplateComponentCardComponent"
                                }
                              }
                            },
                            "x-readme-ref-name": "WhatsappTemplateComponentCard"
                          }
                        }
                      },
                      "x-readme-ref-name": "WhatsappTemplateComponent"
                    }
                  },
                  "ctaUrlLinkTrackingOptedOut": {
                    "type": "boolean",
                    "description": "**Optional.**\nIndicates if template button click tracking is disabled. Set to `true` to disable button click tracking on the template, or `false` to enable.\nYou can disable button click tracking on an individual template by setting this field to `true`. Once disabled, button engagement/clicks will not be displayed in the WhatsApp Manager when viewing the template's insights.\nIf not provided, this value defaults to `false`, which means button click tracking is enabled by default.",
                    "example": true
                  }
                },
                "x-readme-ref-name": "WhatsappTemplateCreateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successfully created a WhatsApp template.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "description": "See [WhatsApp Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates).",
                  "required": [
                    "wabaId",
                    "name",
                    "language"
                  ],
                  "properties": {
                    "officialTemplateId": {
                      "type": "string",
                      "description": "Official template ID assigned by WhatsApp. This ID is used to identify the template in WhatsApp's system.",
                      "example": "official-template-id"
                    },
                    "wabaId": {
                      "type": "string",
                      "description": "WhatsApp Business Account ID.",
                      "example": "whatsapp-business-account-id"
                    },
                    "name": {
                      "type": "string",
                      "description": "Name of the template.",
                      "maxLength": 512,
                      "pattern": "[a-z0-9]{1,512}"
                    },
                    "language": {
                      "type": "string",
                      "description": "Language code of the template. See [Supported Languages](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates#supported-languages) for all codes.",
                      "example": "en"
                    },
                    "category": {
                      "type": "string",
                      "description": "Category of WhatsApp templates.\n- `AUTHENTICATION`: Enable businesses to authenticate users with one-time passcodes, potentially at multiple steps in the login process (e.g., account verification, account recovery, integrity challenges).\n- `MARKETING`: Include promotions or offers, informational updates, or invitations for customers to respond / take action. Any conversation that does not qualify as utility or authentication is a marketing conversation.\n- `UTILITY`: Facilitate a specific, agreed-upon request or transaction or update to a customer about an ongoing transaction, including post-purchase notifications and recurring billing statements.",
                      "enum": [
                        "AUTHENTICATION",
                        "MARKETING",
                        "UTILITY"
                      ],
                      "x-readme-ref-name": "WhatsappTemplateCategory"
                    },
                    "subCategory": {
                      "type": "string",
                      "description": "Subcategory of WhatsApp templates.\n- ORDER_STATUS: Order status template is categorized as `UTILITY` template and apart from name and language of choice, it has general template components such as `BODY`, `FOOTER` and additionally subcategory as `ORDER_STATUS`.",
                      "enum": [
                        "ORDER_STATUS"
                      ],
                      "x-readme-ref-name": "WhatsappTemplateSubCategory"
                    },
                    "previousCategory": {
                      "type": "string",
                      "description": "This field indicates the template's previous category (or `null`, for newly created templates after April 1, 2023). Compare this value to the template's `category` field value, which indicates the template's current category."
                    },
                    "messageSendTtlSeconds": {
                      "type": "integer",
                      "format": "int32",
                      "description": "If we are unable to deliver a message for an amount of time that exceeds its time-to-live, we will stop retrying and drop the message.\nBy default, messages that use an authentication template have a default TTL of **10 minutes**, and messages that use a utility or marketing template have a default TTL of **30 days**.\nSet its value between `30` and `900` seconds (i.e., 30 seconds to 15 minutes) for authentication templates, or `30` and `43200` seconds (i.e., 30 seconds to 12 hours) for utility templates, or `43200` and `2592000` seconds (i.e., 12 hours to 30 days) for marketing templates. Alternatively, you can set this value to `-1`, which will set a custom TTL of 30 days for either type of template.\nWe encourage you to set a time-to-live for all of your authentication templates, preferably equal to or less than your code expiration time, to ensure your customers only get a message when a code is still usable.\nAuthentication templates created before October 23, 2024, have a default TTL of 30 days.",
                      "example": 600
                    },
                    "components": {
                      "type": "array",
                      "description": "Template components. A template consists of `HEADER`, `BODY`, `FOOTER`, and `BUTTONS` components. `BODY` component is required, the other types are optional.",
                      "minItems": 1,
                      "items": {
                        "type": "object",
                        "properties": {
                          "type": {
                            "type": "string",
                            "description": "**Required.** Template component type.\n- `BODY`: Body components are text-only components and are required by all templates. Templates are limited to one body component.\n- `HEADER`: Headers are optional components that appear at the top of template messages. Headers support text, media (images, videos, documents). Templates are limited to one header component.\n- `FOOTER`: Footers are optional text-only components that appear immediately after the body component. Templates are limited to one footer component.\n- `BUTTONS`: Buttons are optional interactive components that perform specific actions when tapped.\n- `LIMITED_TIME_OFFER`: Use for limited-time offer templates. The delivered message can display an offer expiration details section with a heading, an optional expiration timer, and the offer code itself.\n- `CAROUSEL`: Carousel templates allow you to send a single text message (1), accompanied by a set of up to 10 carousel cards (2) in a horizontally scrollable view.\n- `CALL_PERMISSION_REQUEST`: Sending a template message allows you to initiate a user conversation with a call permission request.",
                            "enum": [
                              "BODY",
                              "HEADER",
                              "FOOTER",
                              "BUTTONS",
                              "LIMITED_TIME_OFFER",
                              "CAROUSEL",
                              "CALL_PERMISSION_REQUEST"
                            ]
                          },
                          "format": {
                            "type": "string",
                            "description": "**Required for type `HEADER`.**",
                            "enum": [
                              "TEXT",
                              "IMAGE",
                              "VIDEO",
                              "DOCUMENT",
                              "LOCATION"
                            ]
                          },
                          "text": {
                            "type": "string",
                            "description": "For body text (type = `BODY`), maximum 1024 characters.\nFor header text (type = `HEADER`, format = `TEXT`), maximum 60 characters.\nFor footer text (type = `FOOTER`), maximum 60 characters.\nFor card body text (`CAROUSEL` card component type = `BODY`), maximum 160 characters.",
                            "maxLength": 1024
                          },
                          "buttons": {
                            "type": "array",
                            "description": "**Required for type `BUTTONS`.**\nButtons are optional interactive components that perform specific actions when tapped. Templates can have a mixture of up to 10 button components total, although there are limits to individual buttons of the same type as well as combination limits.\nIf a template has more than three buttons, two buttons will appear in the delivered message and the remaining buttons will be replaced with a **See all options** button. Tapping the **See all options** button reveals the remaining buttons.",
                            "maxItems": 10,
                            "items": {
                              "type": "object",
                              "required": [
                                "type"
                              ],
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "description": "Button type.\n- `PHONE_NUMBER`: Phone number buttons call the specified business phone number when tapped by the app user. Templates are limited to one phone number button.\n- `URL`: URL buttons load the specified URL in the device's default web browser when tapped by the app user. Templates are limited to two URL buttons.\n- `QUICK_REPLY`: Quick reply buttons are custom text-only buttons that immediately message you with the specified text string when tapped by the app user. Templates are limited to 10 quick reply buttons. If using quick reply buttons with other buttons, buttons must be organized into two groups: quick reply buttons and non-quick reply buttons.\n- `COPY_CODE`: Copy code buttons copy a text string (defined when the template is sent in a template message) to the device's clipboard when tapped by the app user. Templates are limited to one copy code button.\n- `OTP`: One-time password (OTP) buttons are a special type of URL button component used with authentication templates.\n- `CATALOG`: When a customer taps the **View catalog** button in a catalog template message, your product catalog appears within WhatsApp.\n- `MPM`: Customers can browse products and sections by tapping the **View items** button in a multi-product template message.\n- `FLOW`: Use this type to specify the [Flow](https://developers.facebook.com/docs/whatsapp/flows) to be sent with the template message.\n- `ORDER_DETAILS`: Provides a order details button with `Review and Pay` text.\n- `VOICE_CALL`: Triggers a WhatsApp call, when clicked by a WhatsApp customer.",
                                  "enum": [
                                    "PHONE_NUMBER",
                                    "URL",
                                    "QUICK_REPLY",
                                    "COPY_CODE",
                                    "OTP",
                                    "CATALOG",
                                    "MPM",
                                    "FLOW",
                                    "ORDER_DETAILS",
                                    "VOICE_CALL"
                                  ],
                                  "x-readme-ref-name": "WhatsappTemplateComponentButtonType"
                                },
                                "text": {
                                  "type": "string",
                                  "description": "**Required for button type `PHONE_NUMBER` or `URL`.** Button text.\nFor `CODE_CODE` buttons, the text is a pre-set value and cannot be customized.\nFor `OTP` buttons, if omitted, the text will default to a pre-set value localized to the template's language. For example, `Copy Code` for English (US). If your template is using a one-tap autofill button and you supply this value, the authentication template message will display a copy code button with this text if we are unable to validate your [handshake](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/autofill-button-authentication-templates#handshake). Maximum 25 characters.",
                                  "maxLength": 25
                                },
                                "url": {
                                  "type": "string",
                                  "description": "**Required for button type `URL`.** URL of website.\nThere can be at most 1 variable at the end of the URL. Example: `https://www.luckyshrub.com/shop?promo={{1}}`.\n2000 characters maximum.",
                                  "maxLength": 2000
                                },
                                "phone_number": {
                                  "type": "string",
                                  "description": "**Required for button type `PHONE_NUMBER`.**\nAlphanumeric string. Business phone number to be (display phone number) called when the user taps the button.\n20 characters maximum.",
                                  "maxLength": 20,
                                  "example": 15550051310
                                },
                                "otp_type": {
                                  "description": "**Required for button type `OTP`.**\nIndicates button OTP type.\nSet to `COPY_CODE` if you want the template to use a copy code button, `ONE_TAP` to have it use a one-tap autofill button, or `ZERO_TAP` to have no button at all.",
                                  "type": "string",
                                  "enum": [
                                    "COPY_CODE",
                                    "ONE_TAP",
                                    "ZERO_TAP"
                                  ],
                                  "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpType"
                                },
                                "autofill_text": {
                                  "type": "string",
                                  "description": "**One-tap and zero-tap buttons only.**\nOne-tap button text.\nMaximum 25 characters.",
                                  "maxLength": 25,
                                  "example": "Autofill"
                                },
                                "package_name": {
                                  "type": "string",
                                  "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour Android app's package name.",
                                  "example": "com.example.myapplication",
                                  "deprecated": true
                                },
                                "signature_hash": {
                                  "type": "string",
                                  "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                  "example": "K8a%2FAINcGX7",
                                  "deprecated": true
                                },
                                "supported_apps": {
                                  "type": "array",
                                  "description": "**One-tap and zero-tap buttons only.**\nList of supported apps.",
                                  "items": {
                                    "description": "The supported_apps array allows you define pairs of app package names and signing key hashes for up to 5 apps. This can be useful if you have different app builds and want each of them to be able to initiate the handshake:",
                                    "type": "object",
                                    "properties": {
                                      "package_name": {
                                        "type": "string",
                                        "description": "Your Android app's package name.",
                                        "example": "com.example.myapplication"
                                      },
                                      "signature_hash": {
                                        "type": "string",
                                        "description": "Your app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                        "example": "K8a%2FAINcGX7"
                                      }
                                    },
                                    "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpSupportedApp"
                                  }
                                },
                                "zero_tap_terms_accepted": {
                                  "type": "boolean",
                                  "description": "**Zero-tap buttons only.**\nSet to `true` to indicate that you understand that your use of zero-tap authentication is subject to the WhatsApp Business Terms of Service, and that it's your responsibility to ensure your customers expect that the code will be automatically filled in on their behalf when they choose to receive the zero-tap code through WhatsApp.\nIf set to `false`, the template will not be created as you need to accept zero-tap terms before creating zero-tap enabled message templates."
                                },
                                "example": {
                                  "type": "array",
                                  "description": "Sample full URL for a `URL` button with a variable.",
                                  "items": {
                                    "type": "string"
                                  }
                                },
                                "flow_id": {
                                  "type": "string",
                                  "description": "**Conditionally required for button type `FLOW`.**\nThe unique ID of the Flow. Cannot be used if `flow_name` or `flow_json` parameters are provided. Only one of these parameters is allowed.",
                                  "example": "1"
                                },
                                "flow_name": {
                                  "type": "string",
                                  "description": "**Conditionally required for button type `FLOW`.**\nThe name of the Flow. Cannot be used if `flow_id` or `flow_json` parameters are provided. Only one of these parameters is allowed. The Flow ID is stored in the message template, not the name, so changing the Flow name will not affect existing message templates."
                                },
                                "flow_json": {
                                  "type": "string",
                                  "description": "**Conditionally required for button type `FLOW`.**\nThe Flow JSON encoded as string with escaping. The Flow JSON specifies the content of the Flow. Cannot be used if `flow_id` or `flow_name` parameters are provided. Only one of these parameters is allowed."
                                },
                                "flow_action": {
                                  "type": "string",
                                  "description": "**Use for button type `FLOW`.**\nEither `navigate` or `data_exchange`. Defaults to `navigate`.",
                                  "example": "navigate"
                                },
                                "navigate_screen": {
                                  "type": "string",
                                  "description": "**Required if `flow_action` is `navigate`.**\nThe unique ID of the Screen in the Flow.",
                                  "example": "WELCOME_SCREEN"
                                },
                                "app_deep_link": {
                                  "type": "object",
                                  "properties": {
                                    "meta_app_id": {
                                      "type": "string",
                                      "description": "Required if using a URL button mapped to a deep link. APP ID.",
                                      "example": "2892949377516980"
                                    },
                                    "android_deep_link": {
                                      "type": "string",
                                      "description": "Required if using a URL button component mapped to a deep link.The WhatsApp client will attempt to load this URI if the WhatsApp user taps the button on an Android device.",
                                      "example": "luckyshrub://deals/summer/"
                                    },
                                    "android_fallback_playstore_url": {
                                      "type": "string",
                                      "description": "Optional. URL of a website that the WhatsApp client will attempt to load in the device’s default web browser when the button is tapped but unable to load the Android deep link URI.",
                                      "example": "https://www.luckyshrub.com/deals/summer/"
                                    }
                                  },
                                  "x-readme-ref-name": "WhatsappTemplateComponentButtonAppDeepLink"
                                }
                              },
                              "x-readme-ref-name": "WhatsappTemplateComponentButton"
                            }
                          },
                          "add_security_recommendation": {
                            "type": "boolean",
                            "description": "**Optional. Only applicable in the `BODY` component of an AUTHENTICATION template.**\nSet to `true` if you want the template to include the string, *For your security, do not share this code.* Set to `false` to exclude the string."
                          },
                          "code_expiration_minutes": {
                            "type": "integer",
                            "format": "int32",
                            "description": "**Optional. Only applicable in the `FOOTER` component of an AUTHENTICATION template.**\nIndicates number of minutes the password or code is valid.\nIf omitted, the code expiration warning will not be displayed in the delivered message.\nMinimum 1, maximum 90.",
                            "maximum": 90,
                            "minimum": 1,
                            "example": 5
                          },
                          "limited_time_offer": {
                            "type": "object",
                            "description": "Use for `LIMITED_TIME_OFFER` components.",
                            "properties": {
                              "text": {
                                "type": "string",
                                "description": "**Required.**\nOffer details text.\nMaximum 16 characters.",
                                "maxLength": 16,
                                "example": "Expiring offer!"
                              },
                              "has_expiration": {
                                "type": "boolean",
                                "description": "**Optional.**\nSet to `true` to have the [offer expiration details](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/limited-time-offer-templates#offer-expiration-details) appear in the delivered message.\nIf set to `true`, the copy code button component must be included in the `buttons` array, and must appear first in the array.\nIf set to `false`, offer expiration details will not appear in the delivered message and the copy code button component is optional. If including the copy code button, it must appear first in the `buttons` array."
                              }
                            },
                            "x-readme-ref-name": "WhatsappTemplateComponentLimitedTimeOffer"
                          },
                          "example": {
                            "type": "object",
                            "description": "**Required** when:\n- `type` is `HEADER`, and `format` is one of `IMAGE`, `VIDEO`, or `DOCUMENT`. Provide a sample media URL in `header_url`.\n- `type` is `HEADER`, `format` is `TEXT`, and a variable is used in `text`. Provide a sample value for that variable in `header_text`. There can be at most 1 variable in `HEADER` text.\n- `type` is `BODY`, and variables are used in `text`. Provide sample values for those variables in `body_text`.",
                            "properties": {
                              "body_text": {
                                "type": "array",
                                "description": "Sample values for variables in `text` of a `BODY` component.",
                                "items": {
                                  "type": "array",
                                  "items": {
                                    "type": "string"
                                  }
                                }
                              },
                              "header_text": {
                                "type": "array",
                                "description": "Sample value for the variable in `text` of a `HEADER` component.",
                                "items": {
                                  "type": "string"
                                }
                              },
                              "header_url": {
                                "type": "array",
                                "description": "Sample media URL for a `HEADER` component whose format is one of `IMAGE`, `VIDEO`, or `DOCUMENT`.\nSupported types:\n- For `IMAGE`, the URL must end with one of `.jpg`, `.jpeg`, or `.png`, size limit is 5MB.\n- For `VIDEO`, the URL must end with `.mp4`, size limit is 16MB.\n- For `DOCUMENT`, the URL must end with `.pdf`, size limit is 100MB.",
                                "items": {
                                  "type": "string"
                                }
                              }
                            },
                            "x-readme-ref-name": "WhatsappTemplateComponentExample"
                          },
                          "cards": {
                            "type": "array",
                            "description": "**Required for type `CAROUSEL`.**\nCarousel templates support up to 10 carousel cards.",
                            "maxItems": 10,
                            "items": {
                              "type": "object",
                              "description": "Carousel templates support up to 10 carousel cards. Cards must have a media header (image or video) and can optionally include body text and up to 2 quick reply buttons, phone number buttons, or URL buttons (button types can be mixed).",
                              "properties": {
                                "components": {
                                  "type": "array",
                                  "description": "**Required.**\nCard components.",
                                  "items": {
                                    "description": "Cards must have a media header (image or video) and can optionally include body text and up to 2 quick reply buttons, phone number buttons, or URL buttons (button types can be mixed).",
                                    "type": "object",
                                    "properties": {
                                      "type": {
                                        "type": "string",
                                        "description": "**Required.**\nCard component type.\n- `BODY`: Body components are text-only components. Cards must have body text.\n- `HEADER`: Cards must have a media header (image or video).\n- `BUTTONS`: Buttons are interactive components that perform specific actions when tapped. Cards must have at least one button, up to 2 buttons.",
                                        "enum": [
                                          "BODY",
                                          "HEADER",
                                          "BUTTONS"
                                        ]
                                      },
                                      "format": {
                                        "type": "string",
                                        "description": "**Required for type `HEADER`.**\nCards must have a media header (image or video).",
                                        "enum": [
                                          "IMAGE",
                                          "VIDEO"
                                        ]
                                      },
                                      "text": {
                                        "type": "string",
                                        "description": "**Required for type `BODY`.**\nCard body text supports variables. Maximum 160 characters.",
                                        "maxLength": 160
                                      },
                                      "buttons": {
                                        "type": "array",
                                        "description": "**Required for type `BUTTONS`.**\nCards must have at least one button. Supports 2 buttons. Buttons can be the same or a mix of quick reply buttons, phone number buttons, or URL buttons.",
                                        "minItems": 1,
                                        "maxItems": 2,
                                        "items": {
                                          "type": "object",
                                          "required": [
                                            "type"
                                          ],
                                          "properties": {
                                            "type": {
                                              "type": "string",
                                              "description": "Button type.\n- `PHONE_NUMBER`: Phone number buttons call the specified business phone number when tapped by the app user. Templates are limited to one phone number button.\n- `URL`: URL buttons load the specified URL in the device's default web browser when tapped by the app user. Templates are limited to two URL buttons.\n- `QUICK_REPLY`: Quick reply buttons are custom text-only buttons that immediately message you with the specified text string when tapped by the app user. Templates are limited to 10 quick reply buttons. If using quick reply buttons with other buttons, buttons must be organized into two groups: quick reply buttons and non-quick reply buttons.\n- `COPY_CODE`: Copy code buttons copy a text string (defined when the template is sent in a template message) to the device's clipboard when tapped by the app user. Templates are limited to one copy code button.\n- `OTP`: One-time password (OTP) buttons are a special type of URL button component used with authentication templates.\n- `CATALOG`: When a customer taps the **View catalog** button in a catalog template message, your product catalog appears within WhatsApp.\n- `MPM`: Customers can browse products and sections by tapping the **View items** button in a multi-product template message.\n- `FLOW`: Use this type to specify the [Flow](https://developers.facebook.com/docs/whatsapp/flows) to be sent with the template message.\n- `ORDER_DETAILS`: Provides a order details button with `Review and Pay` text.\n- `VOICE_CALL`: Triggers a WhatsApp call, when clicked by a WhatsApp customer.",
                                              "enum": [
                                                "PHONE_NUMBER",
                                                "URL",
                                                "QUICK_REPLY",
                                                "COPY_CODE",
                                                "OTP",
                                                "CATALOG",
                                                "MPM",
                                                "FLOW",
                                                "ORDER_DETAILS",
                                                "VOICE_CALL"
                                              ],
                                              "x-readme-ref-name": "WhatsappTemplateComponentButtonType"
                                            },
                                            "text": {
                                              "type": "string",
                                              "description": "**Required for button type `PHONE_NUMBER` or `URL`.** Button text.\nFor `CODE_CODE` buttons, the text is a pre-set value and cannot be customized.\nFor `OTP` buttons, if omitted, the text will default to a pre-set value localized to the template's language. For example, `Copy Code` for English (US). If your template is using a one-tap autofill button and you supply this value, the authentication template message will display a copy code button with this text if we are unable to validate your [handshake](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/autofill-button-authentication-templates#handshake). Maximum 25 characters.",
                                              "maxLength": 25
                                            },
                                            "url": {
                                              "type": "string",
                                              "description": "**Required for button type `URL`.** URL of website.\nThere can be at most 1 variable at the end of the URL. Example: `https://www.luckyshrub.com/shop?promo={{1}}`.\n2000 characters maximum.",
                                              "maxLength": 2000
                                            },
                                            "phone_number": {
                                              "type": "string",
                                              "description": "**Required for button type `PHONE_NUMBER`.**\nAlphanumeric string. Business phone number to be (display phone number) called when the user taps the button.\n20 characters maximum.",
                                              "maxLength": 20,
                                              "example": 15550051310
                                            },
                                            "otp_type": {
                                              "description": "**Required for button type `OTP`.**\nIndicates button OTP type.\nSet to `COPY_CODE` if you want the template to use a copy code button, `ONE_TAP` to have it use a one-tap autofill button, or `ZERO_TAP` to have no button at all.",
                                              "type": "string",
                                              "enum": [
                                                "COPY_CODE",
                                                "ONE_TAP",
                                                "ZERO_TAP"
                                              ],
                                              "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpType"
                                            },
                                            "autofill_text": {
                                              "type": "string",
                                              "description": "**One-tap and zero-tap buttons only.**\nOne-tap button text.\nMaximum 25 characters.",
                                              "maxLength": 25,
                                              "example": "Autofill"
                                            },
                                            "package_name": {
                                              "type": "string",
                                              "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour Android app's package name.",
                                              "example": "com.example.myapplication",
                                              "deprecated": true
                                            },
                                            "signature_hash": {
                                              "type": "string",
                                              "description": "**Deprecated since 2025-07-23. Use `supported_apps` instead.**\n**One-tap and zero-tap buttons only.**\nYour app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                              "example": "K8a%2FAINcGX7",
                                              "deprecated": true
                                            },
                                            "supported_apps": {
                                              "type": "array",
                                              "description": "**One-tap and zero-tap buttons only.**\nList of supported apps.",
                                              "items": {
                                                "description": "The supported_apps array allows you define pairs of app package names and signing key hashes for up to 5 apps. This can be useful if you have different app builds and want each of them to be able to initiate the handshake:",
                                                "type": "object",
                                                "properties": {
                                                  "package_name": {
                                                    "type": "string",
                                                    "description": "Your Android app's package name.",
                                                    "example": "com.example.myapplication"
                                                  },
                                                  "signature_hash": {
                                                    "type": "string",
                                                    "description": "Your app signing key hash. See [App Signing Key Hash](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates/zero-tap-authentication-templates#app-signing-key-hash).",
                                                    "example": "K8a%2FAINcGX7"
                                                  }
                                                },
                                                "x-readme-ref-name": "WhatsappTemplateComponentButtonOtpSupportedApp"
                                              }
                                            },
                                            "zero_tap_terms_accepted": {
                                              "type": "boolean",
                                              "description": "**Zero-tap buttons only.**\nSet to `true` to indicate that you understand that your use of zero-tap authentication is subject to the WhatsApp Business Terms of Service, and that it's your responsibility to ensure your customers expect that the code will be automatically filled in on their behalf when they choose to receive the zero-tap code through WhatsApp.\nIf set to `false`, the template will not be created as you need to accept zero-tap terms before creating zero-tap enabled message templates."
                                            },
                                            "example": {
                                              "type": "array",
                                              "description": "Sample full URL for a `URL` button with a variable.",
                                              "items": {
                                                "type": "string"
                                              }
                                            },
                                            "flow_id": {
                                              "type": "string",
                                              "description": "**Conditionally required for button type `FLOW`.**\nThe unique ID of the Flow. Cannot be used if `flow_name` or `flow_json` parameters are provided. Only one of these parameters is allowed.",
                                              "example": "1"
                                            },
                                            "flow_name": {
                                              "type": "string",
                                              "description": "**Conditionally required for button type `FLOW`.**\nThe name of the Flow. Cannot be used if `flow_id` or `flow_json` parameters are provided. Only one of these parameters is allowed. The Flow ID is stored in the message template, not the name, so changing the Flow name will not affect existing message templates."
                                            },
                                            "flow_json": {
                                              "type": "string",
                                              "description": "**Conditionally required for button type `FLOW`.**\nThe Flow JSON encoded as string with escaping. The Flow JSON specifies the content of the Flow. Cannot be used if `flow_id` or `flow_name` parameters are provided. Only one of these parameters is allowed."
                                            },
                                            "flow_action": {
                                              "type": "string",
                                              "description": "**Use for button type `FLOW`.**\nEither `navigate` or `data_exchange`. Defaults to `navigate`.",
                                              "example": "navigate"
                                            },
                                            "navigate_screen": {
                                              "type": "string",
                                              "description": "**Required if `flow_action` is `navigate`.**\nThe unique ID of the Screen in the Flow.",
                                              "example": "WELCOME_SCREEN"
                                            },
                                            "app_deep_link": {
                                              "type": "object",
                                              "properties": {
                                                "meta_app_id": {
                                                  "type": "string",
                                                  "description": "Required if using a URL button mapped to a deep link. APP ID.",
                                                  "example": "2892949377516980"
                                                },
                                                "android_deep_link": {
                                                  "type": "string",
                                                  "description": "Required if using a URL button component mapped to a deep link.The WhatsApp client will attempt to load this URI if the WhatsApp user taps the button on an Android device.",
                                                  "example": "luckyshrub://deals/summer/"
                                                },
                                                "android_fallback_playstore_url": {
                                                  "type": "string",
                                                  "description": "Optional. URL of a website that the WhatsApp client will attempt to load in the device’s default web browser when the button is tapped but unable to load the Android deep link URI.",
                                                  "example": "https://www.luckyshrub.com/deals/summer/"
                                                }
                                              },
                                              "x-readme-ref-name": "WhatsappTemplateComponentButtonAppDeepLink"
                                            }
                                          },
                                          "x-readme-ref-name": "WhatsappTemplateComponentButton"
                                        }
                                      },
                                      "example": {
                                        "type": "object",
                                        "description": "**Required** when:\n- `type` is `HEADER`, and `format` is one of `IMAGE`, `VIDEO`, or `DOCUMENT`. Provide a sample media URL in `header_url`.\n- `type` is `HEADER`, `format` is `TEXT`, and a variable is used in `text`. Provide a sample value for that variable in `header_text`. There can be at most 1 variable in `HEADER` text.\n- `type` is `BODY`, and variables are used in `text`. Provide sample values for those variables in `body_text`.",
                                        "properties": {
                                          "body_text": {
                                            "type": "array",
                                            "description": "Sample values for variables in `text` of a `BODY` component.",
                                            "items": {
                                              "type": "array",
                                              "items": {
                                                "type": "string"
                                              }
                                            }
                                          },
                                          "header_text": {
                                            "type": "array",
                                            "description": "Sample value for the variable in `text` of a `HEADER` component.",
                                            "items": {
                                              "type": "string"
                                            }
                                          },
                                          "header_url": {
                                            "type": "array",
                                            "description": "Sample media URL for a `HEADER` component whose format is one of `IMAGE`, `VIDEO`, or `DOCUMENT`.\nSupported types:\n- For `IMAGE`, the URL must end with one of `.jpg`, `.jpeg`, or `.png`, size limit is 5MB.\n- For `VIDEO`, the URL must end with `.mp4`, size limit is 16MB.\n- For `DOCUMENT`, the URL must end with `.pdf`, size limit is 100MB.",
                                            "items": {
                                              "type": "string"
                                            }
                                          }
                                        },
                                        "x-readme-ref-name": "WhatsappTemplateComponentExample"
                                      }
                                    },
                                    "x-readme-ref-name": "WhatsappTemplateComponentCardComponent"
                                  }
                                }
                              },
                              "x-readme-ref-name": "WhatsappTemplateComponentCard"
                            }
                          }
                        },
                        "x-readme-ref-name": "WhatsappTemplateComponent"
                      }
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of a WhatsApp template.\n- `PENDING`: The template is still under review. Review can take up to 24 hours.\n- `REJECTED`: The template has been rejected during review process.\n- `APPROVED`: The template is approved, and you may begin sending it to customers.\n- `PAUSED`: The template has been paused due to recurring negative feedback from customers. Message templates with this status cannot be sent to customers. See [Template Pausing](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines#template-pausing).\n- `DISABLED`: The template has been disabled due to recurring negative feedback from customers or for violating one or more of our policies. Message templates with this status cannot be sent to customers. You may be able to edit a disabled message template and request an appeal. See [Appeals](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines#appeals).\n- `IN_APPEAL`: The template is in appeal. See also [Template Appeals](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines#appeals).\n- `DELETED`: The template is deleted.",
                      "enum": [
                        "PENDING",
                        "REJECTED",
                        "APPROVED",
                        "PAUSED",
                        "DISABLED",
                        "IN_APPEAL",
                        "DELETED"
                      ],
                      "example": "REJECTED",
                      "x-readme-ref-name": "WhatsappTemplateStatus"
                    },
                    "qualityRating": {
                      "type": "string",
                      "description": "Quality rating of WhatsApp template. One of `GREEN`, `YELLOW`, `RED`, or `UNKNOWN`. See also [Template Quality Rating](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines/#quality-rating).\n- `GREEN`: High quality.\n- `YELLOW`: Medium quality.\n- `RED`: Low quality.\n- `UNKNOWN`: Unknown quality.",
                      "enum": [
                        "GREEN",
                        "YELLOW",
                        "RED",
                        "UNKNOWN"
                      ],
                      "x-readme-ref-name": "WhatsappTemplateQualityRating"
                    },
                    "reason": {
                      "type": "string",
                      "description": "The reason why the template is rejected."
                    },
                    "createTime": {
                      "type": "string",
                      "format": "date-time",
                      "description": "The time at which this object is created, formatted in [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339). e.g., `2022-06-01T12:00:00.000Z`.",
                      "example": "2022-06-01T12:00:00.000Z"
                    },
                    "updateTime": {
                      "type": "string",
                      "format": "date-time",
                      "description": "The time at which this object is updated, formatted in [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339). e.g., `2022-06-01T12:00:00.000Z`.",
                      "example": "2022-06-01T12:00:00.000Z"
                    },
                    "statusUpdateEvent": {
                      "type": "string",
                      "description": "Used when an event happened on WhatsApp template status updates.\n- `PENDING`: Pending.\n- `APPROVED`: Approved.\n- `REJECTED`: Rejected.\n- `IN_APPEAL`: In appeal. See also [Template Appeals](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines#appeals).\n- `PAUSED`: Paused. See also [Template Pausing](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines#template-pausing).\n- `FLAGGED`: Flagged. The template is scheduled for disabling.\n- `DISABLED`: Disabled. See also [Template Pausing](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines#template-pausing).\n- `REINSTATED`: Reinstated.\n- `PENDING_DELETION`: Pending deletion.",
                      "enum": [
                        "PENDING",
                        "APPROVED",
                        "REJECTED",
                        "IN_APPEAL",
                        "PAUSED",
                        "FLAGGED",
                        "DISABLED",
                        "REINSTATED",
                        "PENDING_DELETION"
                      ],
                      "x-readme-ref-name": "WhatsappTemplateStatusUpdateEventEnum"
                    },
                    "disableDate": {
                      "type": "string",
                      "description": "The date at which the template will be disabled. When a WhatsApp template `FLAGGED` event is received, this field is set.",
                      "example": "December 9, 2022"
                    },
                    "whatsappApiError": {
                      "type": "object",
                      "description": "The original error object returned by WhatsApp. See [Handling Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling), [Cloud API Error Codes](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes).",
                      "required": [
                        "message",
                        "code"
                      ],
                      "properties": {
                        "message": {
                          "type": "string",
                          "description": "A human-readable description of the error.",
                          "example": "HSM Template creation failed"
                        },
                        "code": {
                          "type": "string",
                          "description": "An error code.",
                          "example": 200002
                        },
                        "type": {
                          "type": "string",
                          "description": "Error type.",
                          "example": "OAuthException"
                        },
                        "error_subcode": {
                          "type": "string",
                          "description": "Additional code about the error.",
                          "example": 2388109
                        },
                        "error_user_msg": {
                          "type": "string",
                          "description": "The message to display to the user. The language of the message is based on the locale of the API request.",
                          "example": "This message template cannot be created."
                        },
                        "error_user_title": {
                          "type": "string",
                          "description": "The title of the dialog, if shown. The language of the message is based on the locale of the API request.",
                          "example": "Message Cannot Be Submitted"
                        },
                        "fbtrace_id": {
                          "type": "string",
                          "description": "Internal support identifier. When reporting a bug related to a Graph API call, include the fbtrace_id to help us find log data for debugging.",
                          "example": "AVGjJ7ia2zJkrHG"
                        },
                        "error_data": {
                          "type": "object",
                          "description": "Additional data about the error. A string or map.\n- For template APIs, this field is a string describing the reason for the error.  \n- For message APIs, this field is a map with property `details` describing the reason for the error."
                        }
                      },
                      "x-readme-ref-name": "WhatsappApiError"
                    }
                  },
                  "x-readme-ref-name": "WhatsappTemplate"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "api_key": {
        "type": "apiKey",
        "name": "X-API-Key",
        "in": "header"
      }
    }
  }
}
```