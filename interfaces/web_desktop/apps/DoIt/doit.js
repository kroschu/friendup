/*©agpl*************************************************************************
*                                                                              *
* This file is part of FRIEND UNIFYING PLATFORM.                               *
*                                                                              *
* This program is free software: you can redistribute it and/or modify         *
* it under the terms of the GNU Affero General Public License as published by  *
* the Free Software Foundation, either version 3 of the License, or            *
* (at your option) any later version.                                          *
*                                                                              *
* This program is distributed in the hope that it will be useful,              *
* but WITHOUT ANY WARRANTY; without even the implied warranty of               *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the                 *
* GNU Affero General Public License for more details.                          *
*                                                                              *
* You should have received a copy of the GNU Affero General Public License     *
* along with this program.  If not, see <http://www.gnu.org/licenses/>.        *
*                                                                              *
*****************************************************************************©*/

Application.run = function( msg, iface )
{
	var w = new View( {
		title: 'DoIt!',
		width: 320,
		height: 500
	} );
	
	w.onClose = function()
	{
		Application.quit();
	}
	
	// Main scope shell
	this.shell = new Shell();
	this.shell.onReady = function( data )
	{
		this.ready = true;
	}
	
	// Setup ze menu itemz
	w.setMenuItems( [
		{
			name: 'File',
			items: [
				{
					name: 'Load',
					command: 'loaddoitlist'
				},
				{
					name: 'Save',
					command: 'savedoitlist'
				},
				{
					name: 'Quit',
					command: 'quit'
				}
			]
		},
		{
			name: 'Debugging',
			items: [
				{
					name: 'System list',
					command: 'shell_system_list'
				}
			]
		}
	] );
	
	this.mainView = w;
	
	
	var tpl = new File( 'Progdir:Templates/main.html' );
	tpl.onLoad = function( data )
	{
		w.setContent( data );
	}
	tpl.load();
}

Application.loadList = function( fname )
{
	if( fname && fname.Path )
	{
		var f = new File( fname.Path );
		f.onLoad = function( data )
		{
			var cl = data.split( "\n" );
			var currentList = [];
			for( var a = 0; a < cl.length; a++ )
			{
				if( Trim( cl[a] ).length <= 0 ) continue;
				currentList.push( Trim( cl[a] ) );
			}
			Application.mainView.sendMessage( {
				command: 'setlist',
				list: currentList
			} );
		}
		f.load();
	}
}

Application.saveList = function( fname )
{
	console.log( 'Saving', fname );
}

Application.receiveMessage = function( msg )
{
	if( !msg.command ) return false;
	switch( msg.command )
	{
		case 'loaddoitlist':
			var f = new Filedialog( this.mainView, function( itms )
			{
				Application.loadList( itms[0] );
			}, 'Mountlist:', 'load' );
			break;
		case 'savedoitlist':
			var f = new Filedialog( this.mainView, function( itm )
			{
				Application.saveList( itm );
			}, 'Mountlist:', 'load' );
			break;
		case 'quit':
			this.quit();
			break;
		/* These are just passed on --- */
		case 'close':
			this.mainView.sendMessage( msg );
			break;
		case 'apply':
			this.mainView.sendMessage( msg );
			break;
		/* Debug */
		case 'shell_system_list':
			console.log( 'dir System: (sending this)');
			this.shell.execute( 'dir System:', function( response )
			{
				console.log( 'The response was:', response.data );
			} );
			break;
	}
}

