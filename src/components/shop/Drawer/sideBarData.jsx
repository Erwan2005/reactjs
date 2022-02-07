import React from 'react'
import { Notifications,
		 EnhancedEncryption,
		 Category,
		 Settings,Home,Menu, } from "@material-ui/icons";


export const SideBarData = [

	{
		title: "Notifications",
		icon: <Notifications />,
		link: "/notification",
	},

	{
		title: "Add products",
		icon: <EnhancedEncryption />,
		link: "/add",
	},

	{
		title: "Manage products",
		icon: <Category />,
		link: "/manage",
	},

	{
		title: "Seller Settings",
		icon: <Settings />,
		link: "/seller",
	},
]