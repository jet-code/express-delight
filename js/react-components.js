//
// Express Delight App
// (c) 2016 Jet Code
//
//
// React Components

var MainContainer = React.createClass({

  getInitialState: function() {
    return {menuData: [], orderData: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({menuData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleAddItem: function(menuItem) {
  
    var newData = this.state.orderData;
    newData.push(menuItem);
    this.setState({orderData: newData});
    //this.setState({orderData: this.state.orderData.push(menuItem)});
  },
  
  handleUpdateItem: function(quantity, index) {
    
    var newData = this.state.orderData;
    
    if (quantity > 0) {
      newData[index].quantity = quantity;
      this.setState({orderData: newData});
    }
    else if (quantity === 0) {
      newData.splice(index, 1);
      this.setState({orderData: newData});
    }
  },

  render: function() {
    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12 docs">
            <h1>Express Delight</h1>
            <p>by Alexander Hebert &copy; 2016 Jet Code</p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 docs">
            <h2>Menu</h2>
            <Menu data={this.state.menuData} onAddItem={this.handleAddItem} />
          </div>
          
          <div className="col-md-6 docs">
            <h2>Your Order</h2>
            <CustomerOrder data={this.state.orderData} onUpdateItem={this.handleUpdateItem} />
          </div>
        </div>
        
      </div>
    );
  }
});

var Menu = React.createClass({
  render: function() {
    
    var self = this;
    var menuItems = this.props.data.map(function(item, index) {
      return (
        <MenuItem 
        name={item.name} 
        price={item.price} 
        key={index}
        onAddItem={self.props.onAddItem}>
        </MenuItem>
      );
    });
    
    return (
      <div className="menu">
        <table className="table">
          <thead>
            <tr>
              <th><b>Item</b></th>
              <th className="text-right"><b>Price</b></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {menuItems}
            <CustomMenuItem onAddItem={this.props.onAddItem} />
          </tbody>
        </table>
      </div>
    );
  }
});

var MenuItem = React.createClass({

  handleAddToOrder: function(menuItem) {
    this.props.onAddItem(menuItem);
  },

  render: function() {
    return (
      <tr className="menuItem">
        <td>{this.props.name}</td>
        <td className="text-right">${this.props.price}</td>
        <td className="text-center">
          <button 
            className="btn btn-primary btn-sm" 
            type="button"
            onClick={this.handleAddToOrder.bind(this, 
              {name: this.props.name,
               price: this.props.price,
               quantity: 1,
               customItem: false
              }
            )}
          >Add To Order</button>
        </td>
      </tr>
    );
  }
});

var CustomMenuItem = React.createClass({

  getInitialState: function() {
    return {itemName: '', itemPrice: 199};
  },

  handleItemNameChange: function(event) {
    this.setState({itemName: event.target.value});
  },

  handleAddItem: function() {
    
    var item = {};
    item.name = this.state.itemName.trim();
    item.price = this.state.itemPrice;
    item.quantity = 1;
    item.customItem = true;
    
    if (!item.name) {
      return;
    }
    this.props.onAddItem(item);
    this.setState({itemName: ''});
  },

  render: function() {
  
    return (
      <tr className="customMenuItem">
        <td>
          <input 
           type="text" 
           placeholder="Custom order: enter dish name" 
           value={this.state.itemName}
           onChange={this.handleItemNameChange}
          />
        </td>
        <td className="text-right">${this.state.itemPrice}+</td>
        <td className="text-center">
          <button 
          className="btn btn-primary btn-sm" 
          type="button"
          onClick={this.handleAddItem}>Add To Order</button>
        </td>
      </tr>
    );
  }
});

var CustomerOrder = React.createClass({

  render: function() {
    
    var self = this;
    var orderItems = this.props.data.map(function(item, index) {
      return (
        <OrderItem 
        name={item.name} 
        price={item.price} 
        quantity={item.quantity} 
        index={index} key={index} 
        onUpdateItem={self.props.onUpdateItem}>
        </OrderItem>
      );
    });
    
    return (
      <div className="customerOrder">
        <table className="table">
          <thead>
            <tr>
              <th><b>Item</b></th>
              <th className="text-right"><b>Quantity</b></th>
              <th className="text-right"><b>Price</b></th>
              <th className="text-right"><b>Total</b></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orderItems}
          </tbody>
            <Totals data={this.props.data} />
        </table>
        <div className="text-right">
          <button type="button" className="btn btn-primary btn-md">
            Place Order
          </button>
        </div>
      </div>
    );
  }
});

var OrderItem = React.createClass({

  handleUpdateItem: function(event) {
    this.props.onUpdateItem(event.target.value, this.props.index);
  },
  
  handleRemoveItem: function(quantity, index) {
    this.props.onUpdateItem(quantity, index);
  },

  render: function() {
    return (
      <tr className="orderItem">
        <td>{this.props.name}</td>
        <td className="text-right">
          <input
            type="number" min="1" max="20"
            className="text-right" 
            defaultValue={this.props.quantity} 
            onChange={this.handleUpdateItem}
          /> 
        </td>
        <td className="text-right">${this.props.price}</td>
        <td className="text-right">${this.props.quantity * this.props.price}</td>
        <td className="text-center">
        <span className="glyphicon glyphicon-remove" 
          onClick={this.handleRemoveItem.bind(this, 0, this.props.index)}>
        </span></td>
      </tr>
    );
  }
});

var Totals = React.createClass({

  getInitialState: function() {
    return {takeOut: 1, dineIn: 0, delivery: 0};
  },

  handleTakeOutChange: function(event) {
    this.setState({takeOut: (event.target.value ? 1 : 0),
                   dineIn: 0,
                   delivery: 0});
  },

  handleDineInChange: function(event) {
    this.setState({takeOut: 0,
                   dineIn: (event.target.value ? 1 : 0),
                   delivery: 0});
  },

  handleDeliveryChange: function(event) {
    this.setState({takeOut: 0,
                   dineIn: 0,
                   delivery: (event.target.value ? 1 : 0)});
  },

  render: function() {
  
    var subtotal = 0;
    var deliveryCharge = 350;
    var total = 0;
    var i;
  
    for (i=0; i<this.props.data.length; i++) {
      subtotal += this.props.data[i].quantity * this.props.data[i].price;
    }
    
    total = subtotal + (this.state.delivery * deliveryCharge);
    
    return (
          <tfoot className="totals">
            <tr className="well">
              <td><b>Subtotal</b></td>
              <td></td>
              <td></td>
              <td className="text-right">${subtotal}</td>
              <td></td>
            </tr>
            <tr className="well">
              <td><b>Delivery charge</b></td>
              <td></td>
              <td></td>
              <td className="text-right">${this.state.delivery * deliveryCharge}</td>
              <td></td>
            </tr>
            <tr className="well">
              <td><b>Total</b></td>
              <td></td>
              <td></td>
              <td className="text-right">${total}</td>
              <td></td>
            </tr>
            <tr>
              <td>Checkout Option:</td>
              <td>
                <input type="radio" name="takeOut" checked={this.state.takeOut} onChange={this.handleTakeOutChange} />
                Take Out
              </td>
              <td>
                <input type="radio" name="dineIn" checked={this.state.dineIn} onChange={this.handleDineInChange} />
                Dine In
              </td>
              <td>
                <input type="radio" name="deliver" checked={this.state.delivery} onChange={this.handleDeliveryChange} />
                Deliver
              </td>
              <td></td>
            </tr>
          </tfoot>
    );
  }
});

ReactDOM.render(
  <MainContainer url="/data/menu-items.json" />,
  document.getElementById('content')
);

