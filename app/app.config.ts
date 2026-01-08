export default defineAppConfig({
  ui: {
    colors: {
      primary: "green",
      neutral: "zinc",
    },
    card: {
      variants: {
        variant: {
          solid: {
            root: "bg-inverted text-inverted",
          },
          outline: {
            root: "bg-default ring ring-default divide-y divide-default",
          },

          subtle: {
            root: "light:bg-white ring ring-default divide-y divide-default",
          },
        },
      },
      defaultVariants: {
        variant: "subtle",
      },
    },
  },
})
