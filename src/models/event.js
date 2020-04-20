"use strict";

import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV1
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATE
      },
      endDate: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {}
  );
  Event.associate = function(models) {
    // associations can be defined here
    models.Event.belongsTo(models.User);
  };
  return Event;
};
