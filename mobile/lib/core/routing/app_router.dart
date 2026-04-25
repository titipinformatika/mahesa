import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/pages/splash_screen.dart';
import '../../features/auth/presentation/pages/login_screen.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/profile/presentation/pages/change_password_page.dart';
import '../../features/attendance/presentation/pages/clock_in_out_page.dart';
import '../../features/attendance/presentation/pages/attendance_history_page.dart';
import '../../features/dinas_luar/presentation/pages/riwayat_dl_page.dart';
import '../../features/dinas_luar/presentation/pages/persetujuan_page.dart';
import '../../features/dinas_luar/presentation/pages/peta_pantauan_page.dart';
import '../../features/home/presentation/pages/rekap_tim_page.dart';
import '../../features/announcement/presentation/pages/announcement_list_page.dart';
import '../../features/announcement/presentation/pages/announcement_detail_page.dart';
import '../../features/performance/presentation/pages/layar_laporan_dinas.dart';
import '../../features/performance/presentation/pages/layar_form_laporan_dinas.dart';
import '../../features/dinas_luar/presentation/pages/pengajuan_dl_page.dart';
import '../../features/cuti/presentation/pages/pengajuan_cuti_page.dart';
import '../../features/cuti/presentation/pages/riwayat_cuti_page.dart';

final appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/change-password',
      builder: (context, state) => const ChangePasswordPage(),
    ),
    GoRoute(
      path: '/clock-in-out',
      builder: (context, state) {
        final type = state.extra as String;
        return ClockInOutPage(type: type);
      },
    ),
    GoRoute(
      path: '/attendance-history',
      builder: (context, state) => const AttendanceHistoryPage(),
    ),
    GoRoute(
      path: '/riwayat-dl',
      builder: (context, state) => const RiwayatDLPage(),
    ),
    GoRoute(
      path: '/persetujuan-dl',
      builder: (context, state) => const PersetujuanPage(),
    ),
    GoRoute(
      path: '/peta-pantauan',
      builder: (context, state) => const PetaPantauanPage(),
    ),
    GoRoute(
      path: '/rekap-tim',
      builder: (context, state) => const RekapTimPage(),
    ),
    GoRoute(
      path: '/pengumuman',
      builder: (context, state) => const AnnouncementListPage(),
    ),
    GoRoute(
      path: '/pengumuman/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return AnnouncementDetailPage(id: id);
      },
    ),
    GoRoute(
      path: '/laporan-dinas',
      builder: (context, state) => const LayarLaporanDinas(),
    ),
    GoRoute(
      path: '/form-laporan-dinas',
      builder: (context, state) => const LayarFormLaporanDinas(),
    ),
    GoRoute(
      path: '/pengajuan-dl',
      builder: (context, state) => const PengajuanDLPage(),
    ),
    GoRoute(
      path: '/pengajuan-cuti',
      builder: (context, state) => const PengajuanCutiPage(),
    ),
    GoRoute(
      path: '/riwayat-cuti',
      builder: (context, state) => const RiwayatCutiPage(),
    ),
  ],
);
