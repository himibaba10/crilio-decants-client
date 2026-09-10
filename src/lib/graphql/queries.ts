export const HOME_CATALOG_QUERY = /* GraphQL */ `
  query HomeCatalog {
    products(first: 24, where: { status: "publish", orderby: { field: DATE, order: DESC } }) {
      nodes {
        __typename
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          stockStatus
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              slug
              name
            }
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          stockStatus
          image {
            sourceUrl
            altText
          }
          productCategories {
            nodes {
              slug
              name
            }
          }
        }
      }
    }
    productCategories(first: 12, where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
      nodes {
        databaseId
        name
        slug
        count
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`
