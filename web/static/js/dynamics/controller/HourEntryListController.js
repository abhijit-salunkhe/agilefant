/**
 * Hour entry list controller.
 * 
 * @constructor
 * @base CommonController

 */
var HourEntryListController = function HourEntryListController(options) {
  this.hourEntryListElement = options.hourEntryListElement;
  this.parentModel = options.parentModel;
  this.model = null;
  this.init();
  this.initConfig();
  this.paint();
};
HourEntryListController.prototype = new CommonController();

/**
 * Creates a new story controller.
 */
HourEntryListController.prototype.hourEntryControllerFactory = function(view, model) {
  var hourEntryController = new HourEntryController(model, view, this);
  this.addChildController("hourEntry", hourEntryController);
  return hourEntryController;
};

HourEntryListController.prototype.paintHourEntryList = function() {
  this.hourEntryListView = new DynamicTable(this, this.model, this.hourEntryListConfig,
      this.hourEntryListElement);
  this.hourEntryListView.render();
};

/**
 * Initialize and render the hour entry list.
 */
HourEntryListController.prototype.paint = function() {
  var me = this;
  HourEntryListContainer.initializeFor(this.parentModel, function(model) {
    me.model = model;
    me.paintHourEntryList();
  });
};


HourEntryListController.prototype.reload = function() {
  this.model.reload();
};

HourEntryListController.prototype.addHourEntry = function() {
  var mockModel = ModelFactory.createObject(ModelFactory.types.hourEntry);
  mockModel.setParent(this.parentModel);
  mockModel.setDate(new Date().asString());
  mockModel.setUser(PageController.getInstance().getCurrentUser());
  mockModel.setUsers([], [PageController.getInstance().getCurrentUser()]);
  var controller = new HourEntryController(mockModel, null, this);
  var row = this.hourEntryListView.createRow(controller, mockModel, "top");
  controller.view = row;
  row.autoCreateCells([HourEntryController.columnIndices.actions, HourEntryController.columnIndices.data]);
  row.render();
  controller.openRowEdit();
};

/**
 * Initialize <code>DynamicTableConfiguration</code> for the
 * hour entry list.
 */
HourEntryListController.prototype.initConfig = function() {
  this.hourEntryListConfig = new DynamicTableConfiguration(
      {
        rowControllerFactory : HourEntryListController.prototype.hourEntryControllerFactory,
        dataSource : HourEntryListContainer.prototype.getHourEntries,
        caption : "Spent effort"
      });
  this.hourEntryListConfig.addCaptionItem( {
    name : "addHourentry",
    text : "Add hour entry",
    cssClass : "create",
    callback : HourEntryListController.prototype.addHourEntry
  });
  this.hourEntryListConfig.addColumnConfiguration(HourEntryController.columnIndices.date, {
    minWidth : 120,
    autoScale : true,
    title : "Date",
    get : HourEntryModel.prototype.getDate
  });
  this.hourEntryListConfig.addColumnConfiguration(HourEntryController.columnIndices.user, {
    minWidth : 120,
    autoScale : true,
    title : "User",
    get : HourEntryModel.prototype.getUser,
    decorator: DynamicsDecorators.userNameDecorator
  });
  this.hourEntryListConfig.addColumnConfiguration(HourEntryController.columnIndices.spentEffort, {
    minWidth : 30,
    autoScale : true,
    title : "ES",
    get : HourEntryModel.prototype.getMinutesSpent,
    decorator: DynamicsDecorators.exactEstimateDecorator,
    editable: true,
    edit : {
      editor : "ExactEstimate",
      decorator: DynamicsDecorators.exactEstimateEditDecorator,
      set : HourEntryModel.prototype.setEffortSpent
    }
  });
  this.hourEntryListConfig.addColumnConfiguration(HourEntryController.columnIndices.actions, {
    minWidth : 35,
    autoScale : true,
    cssClass : 'hourEntry-row',
    title : "Delete"
  });
  this.hourEntryListConfig.addColumnConfiguration(HourEntryController.columnIndices.description, {
    minWidth : 200,
    autoScale : true,
    title : "Comment",
    editable: true,
    get : HourEntryModel.prototype.getDescription,
    edit : {
      editor : "Text",
      set : HourEntryModel.prototype.setDescription
    }
  });
  this.hourEntryListConfig.addColumnConfiguration(HourEntryController.columnIndices.buttons, {
    fullWidth : true,
    visible : false,
    cssClass : 'hourEntry-row',
    subViewFactory : DynamicsButtons.commonButtonFactory
  });
  this.hourEntryListConfig.addColumnConfiguration(HourEntryController.columnIndices.data, {
    fullWidth : true,
    cssClass : 'hourEntry-data',
    visible : false
  });
};