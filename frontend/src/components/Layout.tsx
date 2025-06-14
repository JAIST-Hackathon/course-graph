import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

/**
 * ナビゲーションリンクの定義
 * 新しいページを追加する場合はここに追加
 */
const links = [
	{ to: "/", label: "Home" },
	{ to: "/users", label: "Users" },
	{ to: "/ping", label: "Ping" },
];

/**
 * 共通レイアウトコンポーネント
 * ヘッダーナビゲーションとメインコンテンツエリアを提供
 * レスポンシブ対応（デスクトップ/モバイル）
 */
export default function Layout() {
	return (
		<>
			{/* ナビバー */}
			<header className="sticky top-0 z-40 w-full bg-white shadow-sm">
				<nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
					{/* デスクトップ用メニュー */}
					<NavigationMenu className="hidden sm:block">
						<NavigationMenuList className="flex space-x-4">
							{links.map((l) => (
								<NavigationMenuItem key={l.to}>
									<NavLink
										to={l.to}
										end
										className={({ isActive }) =>
											cn(
												"px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
												isActive && "bg-gray-200 font-semibold",
											)
										}
									>
										{l.label}
									</NavLink>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>

					{/* モバイル用メニュー */}
					<Sheet>
						<SheetTrigger asChild className="sm:hidden">
							<Button variant="ghost" size="icon" aria-label="Open menu">
								<Menu className="size-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-64 p-6">
							<SheetTitle className="text-lg font-semibold mb-4">
								MENU
							</SheetTitle>
							<ul className="space-y-2">
								{links.map((l) => (
									<li key={l.to}>
										<NavLink
											to={l.to}
											end
											className={({ isActive }) =>
												cn(
													"block px-3 py-2 rounded-md text-base hover:bg-gray-100",
													isActive && "bg-gray-200 font-semibold",
												)
											}
										>
											{l.label}
										</NavLink>
									</li>
								))}
							</ul>
						</SheetContent>
					</Sheet>
				</nav>
			</header>

			{/* メインコンテンツ */}
			<main className="mx-auto max-w-7xl px-4 py-8">
				<Outlet />
			</main>
		</>
	);
}
