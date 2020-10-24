import React, { useContext, useState } from 'react';
import { Menu, Sidebar } from 'semantic-ui-react';
import { Context } from 'app/globalContext/GlobalContext';

export function LateralMenu({ children }) {
  const {
    state: { showMenu },
    dispatch: { changeShowMenu },
  } = useContext(Context);

  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="push"
        icon="labeled"
        inverted
        vertical
        visible={showMenu}
        onHide={changeShowMenu}
        width="thin"
      >
        <Menu.Item as="a">Home</Menu.Item>
        <Menu.Item as="a">Marketplace</Menu.Item>
      </Sidebar>
      <Sidebar.Pusher dimmed={showMenu}>{children}</Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}