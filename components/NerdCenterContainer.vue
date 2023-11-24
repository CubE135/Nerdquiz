<template>
  <div
    class="relative flex justify-center min-h-screen items-top sm:items-center sm:pt-0"
  >
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <NerdLogo v-if="logo" />
      <Particles
        id="tsparticles"
        :particles-init="particlesInit"
        :options="options"
        class="relative z-negative"
      />
      <slot />
    </div>
  </div>
</template>

<script>

import { loadFull } from 'tsparticles'
export default {
  props: {
    logo: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data () {
    return {
      options: {
        background: {
          color: {
            value: '#100f12'
          }
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: 160,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'image',
            stroke: {
              width: 0,
              color: '#000000'
            },
            polygon: {
              nb_sides: 5
            },
            image: {
              src: 'https://i.ibb.co/b14cvfs/qm.png',
              width: 150,
              height: 237
            }
          },
          opacity: {
            value: 1,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0,
              sync: false
            }
          },
          size: {
            value: 5,
            random: true,
            anim: {
              enable: false,
              speed: 4,
              size_min: 0.3,
              sync: false
            }
          },
          line_linked: {
            enable: false,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 600
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'bubble'
            },
            onclick: {
              enable: true,
              mode: 'repulse'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 250,
              size: 0,
              duration: 2,
              opacity: 0,
              speed: 3
            },
            repulse: {
              distance: 400,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        detectRetina: true
      }
    }
  },
  methods: {
    async particlesInit (engine) {
      await loadFull(engine)
    }
  }
}
</script>

<style scoped>
.z-negative {
  z-index: -1;
}
</style>
