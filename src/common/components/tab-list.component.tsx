import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ITabsMenuTemplate } from "../interfaces/tabs-menu.interface";

interface IAppProps {
    tabs: ITabsMenuTemplate[];
    start?: ITabsMenuTemplate;
    index?: number;
    className?: string;
}

interface IRef {
    disableTabs: (ids: []) => void;
    enableTabs: (ids: []) => void;
    goToTab: (id?: string | number) => void;
}

const TabListComponent = forwardRef<IRef, IAppProps>((props, ref) => {
    const { tabs, className, start, index } = props;
    const [ disables, setDisables ] = useState([]);
    const tabList = {};
    tabs.forEach((tab) => tabList[`${tab.title}`] = {
        content: tab.content,
        action: tab.action
    });
    const [selectedTab, setSelectedTab] = useState<ITabsMenuTemplate>(start || null);

    useImperativeHandle(ref, () => ({
        disableTabs: disableTabs,
        enableTabs: enableTabs,
        goToTab: goToTab
    }));

    function disableTabs(ids: []) {
        setDisables(ids);
    }
    
    function enableTabs(ids: any[]) {
        const newDisables = disables.filter(item => !ids.includes(item))
        setDisables(newDisables);
    }

    function goToTab(id?: string | number) {
        const tab = tabs.find(tab => tab.id === id)
        if(tab) setSelectedTab(tab);
    }

    useEffect(() => {
        if (!selectedTab) if (tabs.length !== 0) {
            setSelectedTab(tabs[0]);
        }
    }, [tabs])

    useEffect(() => {
        if (index) {
            setSelectedTab(tabs[index]);
        }
    }, [index])

    useEffect(() => {
        if (selectedTab) if (selectedTab.action) selectedTab.action();
    }, [selectedTab])

    return (
        <div className={`tabs-component ${className ? className : ""}`}>
            <div className="tabs-selection">
                {tabs.map((tab) => {
                    let active = "";
                    if (selectedTab) if (selectedTab.id === tab.id) active = "active";
                    return (
                        <div className={`tab-option ${disables.includes(tab.id) ? "disabled" : active}`} key={tab.id} onClick={() => {
                            if(!disables.includes(tab.id)) if (isNaN(parseInt(`${index}`))) setSelectedTab(tab);
                        }}>
                            {tab.title}
                        </div>
                    )
                })}
            </div>
            <div className="tabs-content">
                {selectedTab ? tabList[`${selectedTab?.title}`].content : "no data"}
            </div>
        </div>
    )
});

export default TabListComponent;