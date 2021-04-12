## 0.10.0 (2021-04-12)


- fix: actually sort avatars in command output
- feature: ability to enable/disable overlay's bot integration
- build: split dev requirements from app requirements
- build: removed extraneous symlink

## 0.9.0 (2021-04-12)


- feature: dockerized chat bot
- refactor: found a better template syntax highlighting bug workaround

## 0.8.0 (2021-04-12)


- feature: sort avatars list in chatbot output
- style: better keyframes for mario's walking animation
- style: fixed link's walking animation
- refactor: encapsulated avatar registration dedupe
- fix: don't poll choices.json 2x

## 0.7.0 (2021-04-12)


- fix: protect against repeated asset loading
- refactor: encapsulated vue/x dependencies
- feature: exclude chatters from avatars declaratively
- feature: slightly randomized walk interval for all avatars
- style: refactored css to maximize cascading styles, tweaked sprite y positions

## 0.6.1 (2021-04-12)


- fix: maintain x position when swapping avatars
- style: fixed capitalization in unknown avatar message

## 0.6.0 (2021-04-12)


- feature: chatbot integration for self-service
- build: gitignore
- feature: docker-compose

## 0.5.1 (2021-04-12)


- docs: update screenshot
- fix: fix skeleton avatar reference in avatars.json

## 0.5.0 (2021-04-12)


- refactor: rename 'default' avatar to 'skeleton'
- feature: link avatar
- refactor: relative import of avatars module
- refactor: whitespace
- refactor: remove vestigial hidden inputs

## 0.4.0 (2021-04-11)


- feature: load avatars via JSON file instead of HTML elements
- style: only set bg color on body for easier OBS integration
- refactor: 10 second API interval
- style: faster mario animations
- feature: move avatar config to mixin for override
- refactor: move config back into Vuex store
- style: frame-relative bg position with calc()

## 0.3.0 (2021-04-11)


- style: fix label centering
- feature: mario avatar
- style: inline labels

## 0.2.0 (2021-04-11)


- refactor: use Vue mixin for default avatar behavior
- feature: random facing for avatar on instantiation
- style: smooth animation for skeleton
- fix: avatar bounds checking and walking direction
- refactor: prime numbers for random stuff
- style: grey background for demo visibility
- style: arial font
- refactor: 30 second API interval
- feature: avatar CSS self-registration
- feature: avatar registration and randomness
- refactor: use local cors-anywhere container by default
- build: start/stop scripts for docker containers
- refactor: don't track destination in state
- docs: screenshot
- style: move label styles to main stylesheet

## 0.1.1 (2021-04-11)


- fix: can't rely on cors-anywhere demo
- fix: don't overwrite config with undefined
- style: center names

## 0.1.0 (2021-04-11)


- feature: componentize avatars
- feature: animations
- build: meh, 2 spaces looks way better
- build: fix indentation of yaml files
- build: formatting for pre-commit config
- feature: pull chatters and maintain avatar list
- style: reference stylesheet
- refactor: initial commit
