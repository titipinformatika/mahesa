// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(performanceRepository)
final performanceRepositoryProvider = PerformanceRepositoryProvider._();

final class PerformanceRepositoryProvider
    extends
        $FunctionalProvider<
          PerformanceRepository,
          PerformanceRepository,
          PerformanceRepository
        >
    with $Provider<PerformanceRepository> {
  PerformanceRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'performanceRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$performanceRepositoryHash();

  @$internal
  @override
  $ProviderElement<PerformanceRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  PerformanceRepository create(Ref ref) {
    return performanceRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(PerformanceRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<PerformanceRepository>(value),
    );
  }
}

String _$performanceRepositoryHash() =>
    r'460993169577e2e2abad4ea042717329318e8558';

@ProviderFor(penugasanKegiatan)
final penugasanKegiatanProvider = PenugasanKegiatanProvider._();

final class PenugasanKegiatanProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<JenisKegiatanModel>>,
          List<JenisKegiatanModel>,
          FutureOr<List<JenisKegiatanModel>>
        >
    with
        $FutureModifier<List<JenisKegiatanModel>>,
        $FutureProvider<List<JenisKegiatanModel>> {
  PenugasanKegiatanProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'penugasanKegiatanProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$penugasanKegiatanHash();

  @$internal
  @override
  $FutureProviderElement<List<JenisKegiatanModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<JenisKegiatanModel>> create(Ref ref) {
    return penugasanKegiatan(ref);
  }
}

String _$penugasanKegiatanHash() => r'd8dfbdc9e3b81a01f6b79490d09fe4ac1a2c629f';

@ProviderFor(riwayatLhkp)
final riwayatLhkpProvider = RiwayatLhkpFamily._();

final class RiwayatLhkpProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<LhkpModel>>,
          List<LhkpModel>,
          FutureOr<List<LhkpModel>>
        >
    with $FutureModifier<List<LhkpModel>>, $FutureProvider<List<LhkpModel>> {
  RiwayatLhkpProvider._({
    required RiwayatLhkpFamily super.from,
    required String? super.argument,
  }) : super(
         retry: null,
         name: r'riwayatLhkpProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$riwayatLhkpHash();

  @override
  String toString() {
    return r'riwayatLhkpProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<List<LhkpModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<LhkpModel>> create(Ref ref) {
    final argument = this.argument as String?;
    return riwayatLhkp(ref, status: argument);
  }

  @override
  bool operator ==(Object other) {
    return other is RiwayatLhkpProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$riwayatLhkpHash() => r'2ec71538b1e915405b449f82f84613e04bb8334e';

final class RiwayatLhkpFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<List<LhkpModel>>, String?> {
  RiwayatLhkpFamily._()
    : super(
        retry: null,
        name: r'riwayatLhkpProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  RiwayatLhkpProvider call({String? status}) =>
      RiwayatLhkpProvider._(argument: status, from: this);

  @override
  String toString() => r'riwayatLhkpProvider';
}

@ProviderFor(targetReview)
final targetReviewProvider = TargetReviewProvider._();

final class TargetReviewProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<TargetReviewModel>>,
          List<TargetReviewModel>,
          FutureOr<List<TargetReviewModel>>
        >
    with
        $FutureModifier<List<TargetReviewModel>>,
        $FutureProvider<List<TargetReviewModel>> {
  TargetReviewProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'targetReviewProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$targetReviewHash();

  @$internal
  @override
  $FutureProviderElement<List<TargetReviewModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<TargetReviewModel>> create(Ref ref) {
    return targetReview(ref);
  }
}

String _$targetReviewHash() => r'b77d8f66d5db0daf8eed44783e56d4308acff485';

@ProviderFor(persetujuanLhkp)
final persetujuanLhkpProvider = PersetujuanLhkpProvider._();

final class PersetujuanLhkpProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<LhkpModel>>,
          List<LhkpModel>,
          FutureOr<List<LhkpModel>>
        >
    with $FutureModifier<List<LhkpModel>>, $FutureProvider<List<LhkpModel>> {
  PersetujuanLhkpProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'persetujuanLhkpProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$persetujuanLhkpHash();

  @$internal
  @override
  $FutureProviderElement<List<LhkpModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<LhkpModel>> create(Ref ref) {
    return persetujuanLhkp(ref);
  }
}

String _$persetujuanLhkpHash() => r'5fadaff6307fba274d03527b110f6bdd2eb25b80';

@ProviderFor(teamSummary)
final teamSummaryProvider = TeamSummaryProvider._();

final class TeamSummaryProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<TeamMemberSummaryModel>>,
          List<TeamMemberSummaryModel>,
          FutureOr<List<TeamMemberSummaryModel>>
        >
    with
        $FutureModifier<List<TeamMemberSummaryModel>>,
        $FutureProvider<List<TeamMemberSummaryModel>> {
  TeamSummaryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'teamSummaryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$teamSummaryHash();

  @$internal
  @override
  $FutureProviderElement<List<TeamMemberSummaryModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<TeamMemberSummaryModel>> create(Ref ref) {
    return teamSummary(ref);
  }
}

String _$teamSummaryHash() => r'11a901afd27dd6385767dd77394f01b65854206d';

@ProviderFor(LhkpAction)
final lhkpActionProvider = LhkpActionProvider._();

final class LhkpActionProvider
    extends $AsyncNotifierProvider<LhkpAction, void> {
  LhkpActionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'lhkpActionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$lhkpActionHash();

  @$internal
  @override
  LhkpAction create() => LhkpAction();
}

String _$lhkpActionHash() => r'5203fcbdad971e6a29d94fed053bd3ae1f2da036';

abstract class _$LhkpAction extends $AsyncNotifier<void> {
  FutureOr<void> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<void>, void>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<void>, void>,
              AsyncValue<void>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

@ProviderFor(ReviewAction)
final reviewActionProvider = ReviewActionProvider._();

final class ReviewActionProvider
    extends $AsyncNotifierProvider<ReviewAction, void> {
  ReviewActionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'reviewActionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$reviewActionHash();

  @$internal
  @override
  ReviewAction create() => ReviewAction();
}

String _$reviewActionHash() => r'a367bf1655d610adf5ca81016374b1e09ed279e5';

abstract class _$ReviewAction extends $AsyncNotifier<void> {
  FutureOr<void> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<void>, void>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<void>, void>,
              AsyncValue<void>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

@ProviderFor(PimpinanPerformanceAction)
final pimpinanPerformanceActionProvider = PimpinanPerformanceActionProvider._();

final class PimpinanPerformanceActionProvider
    extends $AsyncNotifierProvider<PimpinanPerformanceAction, void> {
  PimpinanPerformanceActionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'pimpinanPerformanceActionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$pimpinanPerformanceActionHash();

  @$internal
  @override
  PimpinanPerformanceAction create() => PimpinanPerformanceAction();
}

String _$pimpinanPerformanceActionHash() =>
    r'bd529aee36adadabf923b4fc38b027aec171fd8f';

abstract class _$PimpinanPerformanceAction extends $AsyncNotifier<void> {
  FutureOr<void> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<void>, void>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<void>, void>,
              AsyncValue<void>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
