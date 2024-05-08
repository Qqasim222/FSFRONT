export const advanceFilterStructure = {
  fields: {
    "name.default": {
      section: "Product",
      field: "Product Name",
      key: "name.default",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
      ],
      rules: ["required"],
    },
    "info.groups.name": {
      section: "Product",
      field: "Group Name",
      key: "info.groups.name",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "info.categoryLabels": {
      section: "Product",
      field: "Category Labels",
      key: "info.categoryLabels",
      type: "Text",
      filtersdata: ["yes", "no"],
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
      ],
      rules: ["required"],
    },
    "info.brand.name": {
      section: "Product",
      field: "Brand Name",
      key: "info.brand.name",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "info.brand.manufacturer.name": {
      section: "Product",
      field: "Manufacturer Name",
      key: "info.brand.manufacturer.name",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "info.state": {
      section: "Product",
      field: "State Label",
      key: "info.state",
      type: "Text",
      filtersdata: [
        "Unreadable photos",
        "Incomplete photos",
        "Photos of multiple products",
        "Non-food item",
        "Deleted by Manufacturer",
        "Archive",
        "Recent photos (less than 2yrs old)",
        "Barcode mismatch",
        "Product labelling not in English",
        "Correct as per labelling",
      ],
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
      ],
      rules: ["required"],
    },
    "info.locked": {
      section: "Product",
      field: "Locked",
      key: "info.locked",
      type: "Text",
      filtersdata: ["yes", "no"],
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
      ],
      rules: ["required"],
    },
    "info.infusionDataSource": {
      section: "Product",
      field: "Infusion data source",
      key: "info.infusionDataSource",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "info.infusionDate": {
      section: "Product",
      field: "Infusion Date",
      key: "info.infusionDate",
      type: "Text",
      filters: [
        {
          label: "Greater Than",
          filter: "greaterThan",
        },
        {
          label: "Less Than",
          filter: "lessThan",
        },
      ],
      rules: ["required"],
    },
    "info.nipType.label": {
      section: "Product",
      field: "Nip Type",
      key: "info.nipType.label",
      type: "Dropdown",
      filtersdata: [
        "Standard",
        "No Nip",
        "Multiple Nip",
        "USA Nip",
        "Standard Plus",
        "EU Standard",
        "EU Standard Plus",
      ],
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
      ],
      rules: ["required"],
    },
    "info.preparedWithWaterOnly": {
      section: "Product",
      field: "Prepared with water only",
      key: "info.preparedWithWaterOnly",
      type: "Text",
      filters: [
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "info.gluten.label": {
      section: "Product",
      field: "Gluten Status",
      key: "info.gluten.label",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
      ],
      filtersdata: [
        "Declared gluten free",
        "Gluten free by ingredients",
        "Contains gluten",
        " Naturally free",
        "Unknown",
      ],
      rules: ["required"],
    },
    "info.Ingredients": {
      section: "Product",
      field: "Ingredients",
      key: "info.Ingredients",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
      ],
      rules: ["required"],
    },
    // dataSource: {
    //   section: "Product",
    //   field: "Data Sources",
    //   key: "dataSource",
    //   type: "Text",
    //   filters: [
    //     {
    //       label: "Equal to",
    //       filter: "equal",
    //     },
    //     {
    //       label: "Not Equal to",
    //       filter: "notEqual",
    //     },
    //     {
    //       label: "In",
    //       filter: "in",
    //     },
    //     {
    //       label: "Not In",
    //       filter: "nin",
    //     },
    //     {
    //       label: "Assigned",
    //       filter: "assigned",
    //     },
    //     {
    //       label: "Not Assigned",
    //       filter: "notAssigned",
    //     },
    //   ],
    //   rules: ["required"],
    // },
    // "dataSource.date": {
    //   section: "Product",
    //   field: "Data Source Date",
    //   key: "dataSource.date",
    //   type: "Text",
    //   filters: [
    //     {
    //       label: "Greater Than",
    //       filter: "greaterThan",
    //     },
    //     {
    //       label: "Less Than",
    //       filter: "lessThan",
    //     },
    //   ],
    // },
    "info.serving.sold.unit.value": {
      section: "Product",
      field: "Serving Size Unit - As Sold",
      key: "info.serving.sold.unit.value",
      type: "Text",
      filtersdata: ["Grams", "mLs"],
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
      ],
      rules: ["required"],
    },
    "info.serving.sold.size": {
      section: "Product",
      field: "Serving Size - As Sold",
      key: "info.serving.sold.size",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "info.serving.prepared.unit.label": {
      section: "Product",
      field: "Serving Size Unit - As Prepared",
      key: "info.serving.prepared.unit.label",
      type: "Text",
      filtersdata: ["Gallon", "Grams", "mLs", "Quart", "Print", "Pound", "Fluid ounces", "Liter", "Ounces (oz)"],
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
      ],
      rules: ["required"],
    },
    "info.serving.prepared.size": {
      section: "Product",
      field: "Serving Size - As Prepared",
      key: "info.serving.prepared.size",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    claim: {
      section: "Product",
      field: "Claims",
      key: "claim",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "claimProduct.claimClassification.name": {
      section: "Product",
      field: "Claim Classifications",
      key: "claimProduct.claimClassification.name",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
      ],
      rules: ["required"],
    },
    "info.allergens.contains": {
      section: "Product",
      field: "Contains allergens",
      key: "info.allergens.contains",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    "info.allergens.myContains": {
      section: "Product",
      field: "May contain allergens",
      key: "info.allergens.myContains",
      type: "Text",
      filters: [
        {
          label: "Equal to",
          filter: "equal",
        },
        {
          label: "Not Equal to",
          filter: "notEqual",
        },
        {
          label: "In",
          filter: "in",
        },
        {
          label: "Not In",
          filter: "nin",
        },
        {
          label: "Assigned",
          filter: "assigned",
        },
        {
          label: "Not Assigned",
          filter: "notAssigned",
        },
      ],
      rules: ["required"],
    },
    // retailers: {
    //   section: "Product",
    //   field: "Retailers",
    //   key: "retailers",
    //   type: "Text",
    //   filters: [
    //     {
    //       label: "Equal to",
    //       filter: "equal",
    //     },
    //     {
    //       label: "Not Equal to",
    //       filter: "notEqual",
    //     },
    //     {
    //       label: "In",
    //       filter: "in",
    //     },
    //     {
    //       label: "Not In",
    //       filter: "nin",
    //     },
    //     {
    //       label: "Assigned",
    //       filter: "assigned",
    //     },
    //     {
    //       label: "Not Assigned",
    //       filter: "notAssigned",
    //     },
    //   ],
    //   rules: ["required"],
    // },
    // "retailers.storename": {
    //   section: "Product",
    //   field: "Store",
    //   key: "retailers.storename",
    //   type: "Text",
    //   filters: [
    //     {
    //       label: "Equal to",
    //       filter: "equal",
    //     },
    //   ],
    //   rules: ["required"],
    // },
  },
};
